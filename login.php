<?php
include_once('includes/token.class.php');
$token = Token::generer('connexion')
?>

<!DOCTYPE html>
<html>

<?php include 'includes/header.php'; ?>
<?php
if (isset($_SESSION['id']) && isset($_SESSION['pseudo']))
       { ?>
        <p>Vous êtes déja connecté !</p>
        Voulez vous <a href="disconnect.php">vous déconnecter</a> ?
<?php  }
else
{
?>
<body>

<div class="container" id="main_page">
	<h1>Connexion</h1>
	<h5>Pas de compte ? <a href="register.php">Inscrivez-vous !</a></h5>
	<form id="loginForm" action="login_conf.php"  method="post">
	<div class="form-group col-xs-5">
	<label for="pseudo"><h3>Nom d'utilisateur :</h3></label>
	<input type="text" class="form-control" name="pseudo" id="pseudo" placeholder="Nom d'utilisateur" required autofocus>
	<br>
	<label for="pass"><h3>Mot de passe :</h3></label>
	<input type="password" class="form-control" name="pass" id="pass" placeholder ="Mot de passe" required autofocus>
	
	<input type="hidden" name="token" id="token" value="<?php echo $token;?>">
	<br>
	<input type="submit" id="submit" class="btn btn-primary" name="submit" value="Connexion">
	</div>
	</form>

	
</div>

<?php  } ?>

</body>
</html>
