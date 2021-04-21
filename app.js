var context;
var pac = new Object();
var pacUp;
var pacDown;
var pacLeft;
var pacRight;
var monster1 = new Object();
var monster2 = new Object();
var monster3 = new Object();
var monster4 = new Object();
var monster1Image;
var monster2Image;
var monster3Image;
var monster4Image;
var wallImage;

var pacImage;
var board;
var score;
var Live = 5;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var firstDraw = false;
var Color5;
var Color15;
var Color25;
var KeyPressedPacImg;


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

	$('#registerDetails').validate({
		rules: {
			regUserName: {required: true},
			regPassword: {required: true,minlength: 6,lettersAndNumbers: true},
			fullName: {required: true,lettersonly: true},
			Email: {required: true,email: true},
			date: {required: true,},
			},
		messages: {
			regUserName: {required: "Please enter a user name",},
			fullName: {required: "Please enter a name",},
			regPassword: {
				required: "please enter a valid password",
				minlength: "Your password most consist at least 6 characters"},
			Email: {required: "please enter a valid email",},
			date: {required: "Please enter a birthdate",}
		}
	})

	$('#Registerbtn').click(function () {
		if ($("#registerDetails").valid()) {
			store();
			changeView(settings);
		}
	});

	$('#setSubmit').click(function () {
		if ($("#settingDetails").valid()) {
			setGame();
		}
	});

	$('#settingDetails').validate({
		rules: {
			ballsNum: {required: true, numberonly: true},
			gameTime: {required: true, time: true},
			upButton: {maxlength: 1,},
			downButton: {maxlength: 1,},
			rightButton: {maxlength: 1,},
			leftButton: {maxlength: 1,},
		},
		messages: {
			ballsNum: {required: "Enter a number between 50 to 90",},
			gameTime: {required: "Enter a number equal or bigger than 60 sec",},
			upBotton: {maxlength: "Enter only one char",},
			downBotton: {maxlength: "Enter only one char",},
			leftBotton: {maxlength: "Enter only one char",},
			rightBotton: {maxlength: "Enter only one char",},
		}
	})
});

function enterUserK() {
	localStorage.setItem("k", "k");
}

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

function randSettings() {
	$("#firstColor").val(getRandColor());
	$("#secondColor").val(getRandColor());
	$("#thirdColor").val(getRandColor());
	let balls = Math.floor(Math.random() * 41) + 50;
	$("#ballsNum").val(balls);
	let time = Math.floor(Math.random() * 61) + 60;
	$("#gameTime").val(time);
	let monsters = Math.floor(Math.random() * 4) + 1;
	$("#monstersNum").val(monsters);
	console.log(getRandColor())
}

function getRandColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
  }

  function setGame() {
	Live = 5;
	changeView(startGame);
	// set arrows
	let upBtn = "38"
	let downBtn = "40"
	let leftBtn = "37"
	let rightBtn = "39"

	// play buttons
	let upTemp = $("#upButton").val();
	if (upTemp != "") {
		upBtn = upTemp.toUpperCase().charCodeAt(0);
	}
	let downTemp = $("#downButton").val();
	if (downTemp != "") {
		downBtn = downTemp.toUpperCase().charCodeAt(0);
	}
	let leftTemp = $("#leftButton").val();
	if (leftTemp != "") {
		leftBtn = leftTemp.toUpperCase().charCodeAt(0);
	}
	let rightTemp = $("#rightButton").val();
	if (rightTemp != "") {
		rightBtn = rightTemp.toUpperCase().charCodeAt(0);
	}

	// Char of play buttons
	let upChar = "🡡"
	let downChar = "🡣"
	let rightChar = "🡢"
	let leftChar = "🡠"

	let upCharTemp = $("#upButton").val();
	if (upCharTemp != ""){
		upLabel.value = upCharTemp;
		upChar = upCharTemp;
	}
	document.getElementById('upLabel').innerHTML = "Up: " + upChar;

	let downCharTemp = $("#downButton").val();
	if (downCharTemp != "") {
		downLabel.value = downCharTemp;
		downChar = downCharTemp;
	}
	document.getElementById('downLabel').innerHTML = "Down: " + downChar;

	let rightCharTemp = $("#rightButton").val();
	if (rightCharTemp != "") {
		rightLabel.value = rightCharTemp;
		rightChar = rightCharTemp;
	}
	document.getElementById('rightLabel').innerHTML = "Right: " + rightChar;

	let leftCharTemp = $("#leftButton").val();
	if (leftCharTemp != "") {
		leftLabel.value = leftCharTemp;
		leftChar = leftCharTemp;
	}
	document.getElementById('leftLabel').innerHTML = "Left: " + leftChar;

	// Num of Balls
	var ballsNum = $("#ballsNum").val();
	ballsLabel.value = ballsNum;
	document.getElementById('ballsLabel').innerHTML = "Number Of Balls: " + ballsNum;
	
	// Time of Game
	gameTime = parseInt($("#gameTime").val());
	timeLabel.value = gameTime;
	document.getElementById('timeLabel').innerHTML = "Game Time: " + gameTime;

	// Num of Monsters
	var monstersNum = $("#monstersNum").val();
	monstersLabel.value = monstersNum;
	document.getElementById('monstersLabel').innerHTML = "Number Of Ghosts: " + monstersNum;

	// Balls colors
	var Color1 = $("#firstColor").val();
	firstColorLabel.value = Color1;
	Color5 = Color1;
	document.getElementById('firstColorLabel').innerHTML = "5 Points Ball Color";
	document.getElementById('firstColorLabel').style.color = Color1;
	var Color2 = $("#secondColor").val();
	SecondColorLabel.value = Color2;
	Color15 = Color2;
	document.getElementById('SecondColorLabel').innerHTML = "15 Points Ball Color";
	document.getElementById('SecondColorLabel').style.color = Color2;
	var Color3 = $("#thirdColor").val();
	ThirdColorLabel.value = Color3;
	Color25 = Color3;
	document.getElementById('ThirdColorLabel').innerHTML = "25 Points Ball Color";
	document.getElementById('ThirdColorLabel').style.color = Color3;

	
	// User name
	userNameLabel.value = userName;
	document.getElementById('userNameLabel').innerHTML = "User Name: " + userName.value;

	// sanding all input to start func
	Start(upBtn, downBtn, leftBtn, rightBtn, ballsNum, gameTime, monstersNum);

}

  

function Start(upBtn, downBtn, leftBtn, rightBtn, ballsNum, gameTime, monstersNum) {

	// pac image
	pacImage = new Image();
	pacImage.src = "Images/tempPac.png";
	pacUp = new Image();
	pacUp.src = "Images/pacUp.png";
	pacDown = new Image();
	pacDown.src = "Images/pacDown.png";
	pacLeft = new Image();
	pacLeft.src = "Images/pacLeft.png";
	pacRight = new Image();
	pacRight.src = "Images/pacRight.png";

	// Monster image

	monster1Image = new Image();
	monster1Image.src = "Images/monster1.jpeg";
	monster2Image = new Image();
	monster2Image.src = "Images/monster2.jpeg";
	monster3Image = new Image();
	monster3Image.src = "Images/monster3.jpeg";
	monster4Image = new Image();
	monster4Image.src = "Images/monster4.jpeg";

	// Wall image
	wallImage = new Image();
	wallImage.src = "Images/wall.jpg";


	board = new Array();
	score = 0;
	var ball_5 = Math.floor(ballsNum*0.6);
	var ball_15 = Math.floor(ballsNum*0.3);
	var ball_25 = ballsNum-ball_5-ball_15;
	gameTime = gameTime
	pac_color = "yellow";
	var cnt = 144; // size of board
	var food_remain = ballsNum; // num of dots
	var monster_remain = monstersNum; // num of monster
	var pacman_remain = 1; 
	start_time = new Date();
	for (var i = 0; i < 12; i++) {
		board[i] = new Array();
		//put obstacles 
		for (var j = 0; j < 12; j++) {
			
			if ((i==0)||(i==11)||(j==0)||(j==11)||
				(i == 3 && j == 3) ||
				(i == 6 && j == 9) ||
				(i == 7 && j == 9) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4;
			} else if (	
				(i == 1 && j == 1) ||
				(i == 1 && j == 10) ||
				(i == 10 && j == 10) ||
				(i == 10 && j == 1)){
				board[i][j] = 3;
				} 
			
			else {
				
					board[i][j] = 0;
				 // TODO: cant put dot in corner
					// var randomNum = Math.random();
					// if (randomNum <= (1.0 * food_remain) / cnt) {
					// 	food_remain--;
					// 	board[i][j] = 5;
					// } else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
						// pac.i = i;
						// pac.j = j;
					// 	pacman_remain--;
					// 	board[i][j] = 2;
					// } else {
					// 	board[i][j] = 0;
					// }
					// cnt--;
				}
		}
	}
	while (pacman_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 2;
		pac.i = emptyCell[0];
		pac.j = emptyCell[1];
		pacman_remain--;
	}
	// while (food_remain > 0) {
	// 	var emptyCell = findRandomEmptyCell(board);
	// 	board[emptyCell[0]][emptyCell[1]] = 5;
	// 	food_remain--;
	// }
	while (ball_5 > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 5;
		ball_5--;
	}
	while (ball_15 > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 15;
		ball_15--;
	}
	while (ball_25 > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 25;
		ball_25--;
	}
	while (monster_remain > 0) {
		board[1][1] = 3;
		board[1][10] = 3;
		board[10][10] = 3;
		board[10][1] = 3;
		if (monster_remain == 4){
			monster1.i = 1;
			monster1.j = 1;}
		if (monster_remain == 3){
			monster2.i = 1;
			monster2.j = 10;}
	    if (monster_remain == 2){
			monster3.i = 10;
			monster3.j = 10;}
		if (monster_remain == 1){
			monster4.i = 10;
			monster4.j = 1;}
		monster_remain--;
	}

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

	function reset() {

	};

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 10 + 1);
	var j = Math.floor(Math.random() * 10 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 10 + 1);
		j = Math.floor(Math.random() * 10 + 1);
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

	for (var i = 0; i < 12; i++) {
		for (var j = 0; j < 12; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				if (KeyPressedPacImg==1){
					context.drawImage(pacUp, center.x-30, center.y-30 ,60,60);
				}
				if (KeyPressedPacImg==2){
					context.drawImage(pacDown, center.x-30, center.y-30 ,60,60);
				}
				if (KeyPressedPacImg==3){
					context.drawImage(pacLeft, center.x-30, center.y-30 ,60,60);
				}
				if (KeyPressedPacImg==4){
					context.drawImage(pacRight, center.x-30, center.y-30 ,60,60);
				}
				if (KeyPressedPacImg==null){
					context.drawImage(pacRight, center.x-30, center.y-30 ,60,60);
				}
				// context.beginPath();
				// context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				// context.lineTo(center.x, center.y);
				// context.fillStyle = pac_color; //color
				// context.fill();
				// context.beginPath();
				// context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				// context.fillStyle = "black"; //color
				// context.fill();
			} else if (board[i][j] == 5) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = Color5; //color
				context.fill();
			} else if (board[i][j] == 15) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = Color15; //color
				context.fill();
			} else if (board[i][j] == 25) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = Color25; //color
				context.fill();
			} else if (board[i][j] == 3) {
				//context.drawImage(monsterImage, monster.i, monster.j,60,60);
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "pink"; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.drawImage(wallImage, center.x-30, center.y-30 ,60,60);

				// context.beginPath();
				// context.rect(center.x - 30, center.y - 30, 60, 60);
				// context.fillStyle = "grey"; //color
				// context.fill();
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
		if (pac.j < 10 && board[pac.i][pac.j + 1] != 4) {
			pac.j++;
		}
		if (pac.j < 10 && board[pac.i][pac.j + 1] == 3) {
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
		if (pac.i < 10 && board[pac.i + 1][pac.j] != 4) {
			pac.i++;
		}
		if (pac.i < 10 && board[pac.i + 1][pac.j] == 3) {
			//Live --
		}
	}

	if(pac.i == monster1.i && pac.j == monster1.j){ Live--; Start() } //reset
	if(pac.i == monster2.i && pac.j == monster2.j){ Live--; Start() }
	if(pac.i == monster3.i && pac.j == monster3.j){ Live--; Start() }
	if(pac.i == monster4.i && pac.j == monster4.j){ Live--; Start() }

	if (board[pac.i][pac.j] == 5) {
		score = score + 5;
	}
	if (board[pac.i][pac.j] == 15) {
		score = score + 15;
	}
	if (board[pac.i][pac.j] == 25) {
		score = score + 25;
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
		if (x != null){
			KeyPressedPacImg=x;
		}
		Draw();
	}
}

function changeView(page) {
	if (page == welcome) {
		$("#welcome").show();
		$("#login").hide();
		$("#register").hide();
		$("#about").hide();
		$("#settings").hide();
		$("#startGame").hide();
	}

	else if (page == register) {
		$("#register").show();
		$("#welcome").hide();
		$("#login").hide();
		$("#about").hide();
		$("#settings").hide();
		$("#startGame").hide();

	}

	else if (page == login) {
		$("#login").show();
		$("#welcome").hide();
		$("#register").hide();
		$("#about").hide();
		$("#settings").hide();
		$("#startGame").hide();
	}

	else if (page == settings) {
		$("#settings").show();
		$("#welcome").hide();
		$("#login").hide();
		$("#register").hide();
		$("#about").hide();
		$("#startGame").hide();

	}
	else if (page == startGame) {
		$("#startGame").show();
		$("#welcome").hide();
		$("#login").hide();
		$("#register").hide();
		$("#about").hide();
		$("#settings").hide();
	}
}
