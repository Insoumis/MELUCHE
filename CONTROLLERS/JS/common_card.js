/*

SCRIPT COMMUN DE PARTAGE / VOTE DES CARTES

*/


var urlBase = location.href.substring(0, location.href.lastIndexOf("/")+1);

//date actuelle
var now = new Date();


//Facebook SDK pour le partage
window.fbAsyncInit = function() {
	FB.init({
		appId      : '1849815745277262',
		xfbml      : true,
		version    : 'v2.8'
	});
	
	FB.AppEvents.logPageView();
};

(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


//Fonctions de partage
function shareFacebook(e) {
	//ne propage pas l'event à la carte
	e.stopPropagation();
	var card = $(e.target).closest(".card, .big-card");
	var url = urlBase+"view.php?id=" + card.attr("id");

	FB.ui(
 	{
		method: 'share',
		mobile_iframe: true,
		hashtag: '#jlm2017',
		href: url
	}, function(response){});
}

function shareTwitter(e) {
	e.stopPropagation();
	var card = $(e.target).closest(".card, .big-card");
	var url = urlBase+"view.php?id=" + card.attr("id");
	window.open("https://twitter.com/share?url="+escape(url)+"&hashtags=jlm2017", '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');

}

function shareGplus(e) {
	e.stopPropagation();
	var card = $(e.target).closest(".card, .big-card");
	var url = urlBase+"view.php?id=" + card.attr("id");
	window.open("https://plus.google.com/share?url="+escape(url), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');


}




//Retourne un string du temps passé depuis un timestamp
function getTimeElapsed(date) {
	
	var temps = "";
	var d = date.split(" ");
	
	//temps hh-mm-ss
	var t = d[1];

	//date yyyy-mm-dd
	d = d[0];

	var dd = d.split("-");
	var tt = t.split(":");

	var y = dd[0];
	var m = dd[1] - 1;
	d = dd[2];

	var h = tt[0];
	var min = tt[1];
	var s = tt[2];

	if(now.getFullYear() != y) {
		temps = now.getFullYear() - y;
		if(temps == 1)
			temps += " an";
		else
			temps += " années";
	} else if(now.getMonth() != m) {
		temps = now.getMonth() - m;
		temps += " mois";
	} else if(now.getDate() != d) {
		temps = now.getDate() - d;
		if(temps == 1)
			temps += " jour";
		else
			temps += " jours";
	} else if(now.getHours() != h) {
		temps = now.getHours() - h;
		if(temps == 1)
			temps += " heure";
		else
			temps += " heures";
	} else if(now.getMinutes() != min) {
		temps = now.getMinutes() - min;
		if(temps == 1)
			temps += " minute";
		else
			temps += " minutes";
	} else if(now.getSeconds() != s) {
		temps = now.getSeconds() - s;
		if(temps == 1)
			temps += " seconde";
		else
			temps += " secondes";
	} else {
		temps = "à l'instant";
	}


	return temps;
}
function thumbUp(id, card) {
	var btn = card.find('.card-thumb-up');

	if($('#connected').val() == "no") {
		showVoteError();
		return;
	}
	if(!btn.hasClass("voted")) {
		var currentV = parseInt(card.find('.big-card-points').html());
		if(!currentV)
			currentV = card.data('points');
		if(card.find(".card-thumb-down").hasClass("voted")) {
			currentV ++;
		}
	
		currentV++;
		card.find('.big-card-points').html(currentV);
		card.data('points', currentV);
					
		btn.addClass("voted");
		btn.siblings(".card-thumb-down").removeClass("voted");
		card.css('background', '#23b9d0');
		card.stop(true, false).animate({backgroundColor: '#ffffff'}, 700);

		vote(id, 1);

	}
}

	
function thumbDown(id, card) {
	var btn = card.find('.card-thumb-down');

	if($('#connected').val() == "no") {
		showVoteError();
		return;
	}
	
	if(!btn.hasClass("voted")) {
		var currentV = parseInt(card.find('.big-card-points').html());
		if(!currentV)
			currentV = card.data('points');
		if(card.find(".card-thumb-up").hasClass("voted"))
			currentV --;
	
		currentV--;
		card.find('.big-card-points').html(currentV);
		card.data('points', currentV);
			
		btn.addClass("voted");
		btn.siblings(".card-thumb-up").removeClass("voted");
		card.css('background', '#e23d22');
		card.stop(true, false).animate({backgroundColor: '#ffffff'}, 700);
		
		vote(id, -1);
	}
}
	


function checkVote(card) {
	$.post(
		'MODELS/check_vote.php',
		{idhash: card.attr('id')},
		returnVote,
		'text'
	);
	
	function returnVote(ancien) {
		ancien = parseInt(ancien);
		if(ancien == 1) {
			$(card).find('.card-thumb-up').addClass('voted');
			$(card).find('.card-thumb-down').removeClass('voted');
		} else if(ancien == -1) {
			$(card).find('.card-thumb-down').addClass('voted');
			$(card).find('.card-thumb-up').removeClass('voted');
			
		}
	}
}


function vote(id, vote) {
	var http = new XMLHttpRequest();
	var url = "MODELS/vote_conf.php";
	var params = "idhash="+id+"&vote="+vote;
	http.open("post", url, true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.send(params);
}


//Fonctions de vote
function upVote(e) {
	e.stopPropagation();
	if($('#connected').val() == 'no') {
		showVoteError();
		return;
	}
	
	
	if(!$(this).hasClass('voted')) {
		var points = $(this).closest('.card, .big-card').find('.points, .big-card-points').html();
		points = parseInt(points);
		points ++;
		if($(this).parent().find(".downvote").hasClass("voted"))
			points ++;
		console.log(points);
		$(this).closest('.card, .big-card').find('.points, .big-card-points').html(points);
	
	
	
		$(this).addClass("voted");
		$(this).parent().find(".downvote").removeClass("voted");
		//send vote to server
	
		var id = $(this).closest(".card, .big-img-container").attr("id");
		var http = new XMLHttpRequest();
		var url = "MODELS/vote_conf.php";
		var params = "id_image="+id+"&vote=1";
		http.open("post", url, true);
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		/*
		http.onreadystatechange = function() {
			if(http.readystate == 4 && http.status == 200) {
				alert(http.responsetext);
			}
		} */
		http.send(params);

	}
}

function downVote(e) {
	e.stopPropagation();
	if($('#connected').val() == 'no') {
		showVoteError();
		return;
	}

	if(!$(this).hasClass('voted')) {
		var points = $(this).closest('.card, .big-img-container').find('.points').html();
		points = parseInt(points);
		points --;
		if($(this).parent().find(".upvote").hasClass("voted"))
			points --;
		console.log(points);
		$(this).closest('.card, .big-img-container').find('.points').html(points);
	

		$(this).addClass("voted");
		$(this).parent().find(".upvote").removeClass("voted");
		//send vote to server
	
		var id = $(this).closest(".card, .big-img-container").attr("id");
		
		var http = new XMLHttpRequest();
		var url = "MODELS/vote_conf.php";
		var params = "id_image="+id+"&vote=-1";
		http.open("POST", url, true);
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		/*
		http.onreadystatechange = function() {
			if(http.readyState == 4 && http.status == 200) {
				alert(http.responseText);
			}
		} */
		http.send(params);
	}
}


//affiche erreur si pas loggé
function showVoteError() {
	var e = `<div id='voteerror' class='alert alert-danger erreur'>
	      <a href="#" class="close" data-dismiss="alert" aria-label="fermer">×</a>
		  Vous devez être connecté pour pouvoir voter. <a href='login.php'>Se connecter</a>.
		  </div>`;

	var erreur = $(e);
	$('#main_page').prepend(erreur);
	erreur.delay(2000).animate({'opacity': '0'}, 1000, function() {
		erreur.remove();		
	});
}
