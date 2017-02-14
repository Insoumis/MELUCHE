<?php
include_once ("includes/constants.php");

/*
ERREURS RETOURNEES:

notlogged
captcha
size
format
titre

*/
include ("includes/identifiants.php");
include_once ('includes/securite.class.php');

$img = $_FILES['file'];

if (!isset($_SESSION)) {
    session_start ();
}
$id_user = $_SESSION['id'];
if (!$id_user) header ('Location:upload.php?erreur=notlogged');

$captcha = $_POST['g-recaptcha-response'];
if (!$captcha) {
    header ('Location:upload.php?erreur=captcha');
    exit();
}
// Verification de la validité du captcha
$response = file_get_contents ("https://www.google.com/recaptcha/api/siteverify?secret=6LefaBUUAAAAAOCU1GRih8AW-4pMJkiRRKHBmPiE&response=" . $captcha);
$decoded_response = json_decode ($response);
if ($decoded_response->success == false) {
    header ('Location:upload.php?erreur=captcha');
    exit();
}

$max_size = 1000000;
if ($img['size'] > $max_size) {
    header ('Location:upload.php?erreur=size');
    exit();
}

$extensions_valides = array('jpg', 'jpeg', 'gif', 'png');
$extension_image = strtolower (substr (strrchr ($img['name'], '.'), 1));
if (!in_array ($extension_image, $extensions_valides)) {
    header ('Location:upload.php?erreur=format');
    exit();
}

$titre = $_POST['titre'];
if (strlen($titre) > 255 || strlen($titre) == 0) {
    header ('Location:upload.php?erreur=titre');
    exit();
}

$req = $bdd->prepare ('INSERT INTO images(titre, id_user, date_creation) VALUES(:titre, :id_user, NOW())');
$req->execute ([
    ':titre' => htmlspecialchars ($_POST['titre']),
    ':id_user' => $id_user,
]);

$id = $bdd->lastInsertId ();
$id = sha1 ($id . SALT_ID);
$direction = '/images/' . $id . "." . $extension_image;
if(move_uploaded_file ($img['tmp_name'], __DIR__ . $direction))
	echo "oui";
else
	echo "non";

$imagebase = __DIR__ . $direction;
list($width, $height) = getimagesize ($imagebase);

if (($extension_image == "jpg") OR ($extension_image == "jpeg")) {
    $source = imagecreatefromjpeg ($imagebase);
} elseif ($extension_image == "png") {
    $source = imagecreatefrompng ($imagebase);
} elseif ($extension_image == "gif") {
    $source = imagecreatefromgif ($imagebase);
}

if ($width >= $height)
{
    $ratio = $width/300;
} else {
    $ratio = $height/300;
}
$newwidth = $width/$ratio;
$newheight = $height/$ratio;
$thumb = imagecreatetruecolor ($newwidth, $newheight);
imagecopyresized ($thumb, $source, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);

if (($extension_image == "jpg") OR ($extension_image == "jpeg")) {
    imagejpeg ($thumb, __DIR__ . '/vignettes/' . $id . '.jpg');
} elseif ($extension_image == "png") {
    imagepng ($thumb, __DIR__ . '/vignettes/' . $id . '.png');
} elseif ($extension_image == "gif") {
    imagegif ($thumb, __DIR__ . '/vignettes/' . $id . '.gif');
}
?>
