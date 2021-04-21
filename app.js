var context;
var pac = new Object();
var monster1 = new Object();
var monster2 = new Object();
var monster3 = new Object();
var monster4 = new Object();
var monster1Image;
var monster2Image;
var monster3Image;
var monster4Image;

var pacImage;
var board;
var score;
var Live = 5;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var lostGame = false;

$(document).ready(function() {
	context = canvas.getContext("2d");
	enterUserK();

	jQuery.validator.addMethod("lettersonly", function (value, element) {
		return this.optional(element) || /^[a-z]+$/i.test(value);
	}, "Letters only please");

	jQuery.validator.addMethod("lettersAndNumbers", function (value, element) {
		return this.optional(element) || /[a-z].[0-9]|[0-9].[a-z]/i.test(value);
	}, "password must contain both numbers and letters please");

	jQuery.validator.addMethod("time", function (value, element) {
		return this.optional(element) || /^([6-9]\d|[1-9]\d{2,})$/i.test(value);
	}, "the time of the game must be bigger than 60");

	jQuery.validator.addMethod("numberonly", function (value, element) {
		return this.optional(element) || /^[5-8][0-9]?$|^90$/i.test(value);
	}, "the number of balls must be between 50-90");

	$('#registerForm').validate({
		rules: {
			regUserName: {required: true},
			regPassword: {required: true,minlength: 6,lettersAndNumbers: true},
			fullName: {required: true,lettersonly: true},
			Email: {required: true,email: true},
			date: {required: true,},
			},
		messages: {
			regUserName: {required: "\n Please enter a user name",},
			fullName: {required: "Please enter a name",},
			regPassword: {
				required: "\n please enter a valid password",
				minlength: "\n Your password most consist at least 6 characters"},
			Email: {required: "\n please enter a valid email",},
			date: {required: "\n Please enter a birthdate",}
		}
	})

	$('#Registerbtn').click(function () {
		if ($("#registerForm").valid()) {
			store();
			changeView(settings);
		}
	});

	Start();
});

function enterUserK() {
	localStorage.setItem("k", "k");
}

//var userName = document.getElementById('userName');
//var password = document.getElementById('password');

function store() {
	userName = $("#regUserName").val();
	let userPassword = $("#regPassword").val();
	localStorage.setItem(userName, userPassword);
	alert('You have seccesfully registered!');
}

function checkLogin() {
	var ans;
	userName = document.getElementById('userName');
	let userPassword = document.getElementById('password');
	//let storedUserName = localStorage.key(userPassword);
	let storedPassword = localStorage.getItem(userName.value);
	if (userPassword.value == storedPassword) { // check Password in DB
		alert('logged in seccesfully!');
		ans = true;
	} else  {
		alert('Invalid details!');
		ans = false;
	}

	if (ans == true) {
		changeView(settings);
	}
}


function Start() {

		// pac image
	
		pacImage = new Image();
		pacImage.src = "Images/tempPac.png";
	
		// Monster image
	
		monster1Image = new Image();
		monster1Image.src = "Images/monster1.jpeg";
		monster2Image = new Image();
		monster2Image.src = "Images/monster2.jpeg";
		monster3Image = new Image();
		monster3Image.src = "Images/monster3.jpeg";
		monster4Image = new Image();
		monster4Image.src = "Images/monster4.jpeg";


	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100; // size of board
	var food_remain = 50; // num of dots
	var monster_remain = 4; // num of monster
	var pacman_remain = 1; 
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles 
		for (var j = 0; j < 10; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4;
			} else {
				 // TODO: cant put dot in corner
					var randomNum = Math.random();
					if (randomNum <= (1.0 * food_remain) / cnt) {
						food_remain--;
						board[i][j] = 1;
					} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
						pac.i = i;
						pac.j = j;
						pacman_remain--;
						board[i][j] = 2;
					} else {
						board[i][j] = 0;
					}
					cnt--;
				}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
	while (monster_remain > 0) {
		board[0][0] = 3;
		board[0][9] = 3;
		board[9][9] = 3;
		board[9][0] = 3;
		if (monster_remain == 4){
			monster1.i = 0;
			monster1.j = 0;}
		if (monster_remain == 3){
			monster2.i = 0;
			monster2.j = 9;}
	    if (monster_remain == 2){
			monster3.i = 9;
			monster3.j = 9;}
		if (monster_remain == 1){
			monster4.i = 9;
			monster4.j = 0;}
		monster_remain--;
	}
	function reset() {

			var emptyCell = findRandomEmptyCell(board); // place pac
			board[emptyCell[0]][emptyCell[1]] = 2;

		monster_remain = 4
		while (monster_remain > 0) {
			board[0][0] = 3;
			board[0][9] = 3;
			board[9][9] = 3;
			board[9][0] = 3;
			if (monster_remain == 4){
				monster1.i = 0;
				monster1.j = 0;}
			if (monster_remain == 3){
				monster2.i = 0;
				monster2.j = 9;}
			if (monster_remain == 2){
				monster3.i = 9;
				monster3.j = 9;}
			if (monster_remain == 1){
				monster4.i = 9;
				monster4.j = 0;}
			monster_remain--;
		}
		Draw()
	};

	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 250);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) {
		return 2;
	}
	if (keysDown[37]) {
		return 3;
	}
	if (keysDown[39]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	lblLive.value = Live;

	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				//context.drawImage(pacImage, pac.i, pac.j,60,60);
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 3) {
				//context.drawImage(monsterImage, monster.i, monster.j,60,60);
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "pink"; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
}

function UpdatePosition() {
	board[pac.i][pac.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (pac.j > 0 && board[pac.i][pac.j - 1] != 4) { // move pac down
			pac.j--;
		}
		if (pac.j > 0 && board[pac.i][pac.j - 1] == 3) { // move pac down
			//Live --
		}
	}
	if (x == 2) {
		if (pac.j < 9 && board[pac.i][pac.j + 1] != 4) {
			pac.j++;
		}
		if (pac.j < 9 && board[pac.i][pac.j + 1] == 3) {
			//Live --
		}
	}
	if (x == 3) {
		if (pac.i > 0 && board[pac.i - 1][pac.j] != 4) {
			pac.i--;
		}
		if (pac.i > 0 && board[pac.i - 1][pac.j] == 3) {
			//Live --
		}
	}
	if (x == 4) {
		if (pac.i < 9 && board[pac.i + 1][pac.j] != 4) {
			pac.i++;
		}
		if (pac.i < 9 && board[pac.i + 1][pac.j] == 3) {
			//Live --
		}
	}

	if(pac.i == monster1.i && pac.j == monster1.j){ Live--; Start() } //reset
	if(pac.i == monster2.i && pac.j == monster2.j){ Live--; Start() }
	if(pac.i == monster3.i && pac.j == monster3.j){ Live--; Start() }
	if(pac.i == monster4.i && pac.j == monster4.j){ Live--; Start() }

	if (board[pac.i][pac.j] == 1) {
		score++;
	}
	board[pac.i][pac.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}
}

function changeView(pageName) {
	if (pageName == login) {
		$("#welcome").hide();
		$("#login").show();
		$("#register").hide();
		$("#about").hide();
		$("#settings").hide();
		$("#Game").hide();


	}
	else if (pageName == welcome) {
		$("#welcome").show();
		$("#login").hide();
		$("#register").hide();
		$("#about").hide();
		$("#settings").hide();
		$("#Game").hide();


	}
	else if (pageName == register) {
		$("#welcome").hide();
		// $("#login").hide();
		$("#register").show();
		// $("#about").hide();
		// $("#settings").hide();
		// $("#Game").hide();

	}
	else if (pageName == settings) {
		$("#welcome").hide();
		$("#login").hide();
		$("#register").hide();
		$("#about").hide();
		$("#settings").show();
		$("#Game").hide();

	}
	else if (pageName == Game) {
		$("#welcome").hide();
		$("#login").hide();
		$("#register").hide();
		$("#about").hide();
		$("#settings").hide();
		$("#Game").show();

	}
}
