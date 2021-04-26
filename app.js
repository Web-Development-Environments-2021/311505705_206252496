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
var ballsFirstNum;
var pac_color;
var startTime;
var time_elapsed;
var firstDraw = false;
var Color5;
var Color15;
var Color25;
var KeyPressedPacImg;
var monster1LastPos=0;
var monster2LastPos=0;
var monster3LastPos=0;
var monster4LastPos=0;
var numOfMonster=0;
var bonus = new Object();
var bonusImage;
var bonusLastPos = 0;
var isBonus = false;
var pill = new Object();
var pillImage;
var isClock = false;
var clock = new Object();
var clockImage;
var sound = new Audio('Images/Bakara.mp3');
sound.volume = 0.2;
var eatSound = new Audio('Images/eatBonus.m4a');
eatSound.volume = 0.1;
var dieSound = new Audio('Images/die.mp3');
dieSound.volume = 0.1;
var userName;
var interval1;
var interval2;


$(document).ready(function() {
	context = canvas.getContext("2d");
	enterUserK();

	jQuery.validator.addMethod("lettersOnly", function (value, element) {
		return this.optional(element) || /^[a-z\s]+$/i.test(value);
	}, "Full name must be letters only");

	jQuery.validator.addMethod("lettersAndNumbers", function (value, element) {
		return this.optional(element) || /[a-z].[0-9]|[0-9].[a-z]/i.test(value);
	}, "Password must contain both letters and numbers");

	jQuery.validator.addMethod("time", function (value, element) {
		return this.optional(element) || /^([6-9]\d|[1-9]\d{2,})$/i.test(value);
	}, "Game time must be longer than 60 sec");

	jQuery.validator.addMethod("numberOnly", function (value, element) {
		return this.optional(element) || /^[5-8][0-9]?$|^90$/i.test(value);
	}, "Number of balls must be between 50 to 90");

	$('#registerDetails').validate({
		rules: {
			regUserName: {required: true},
			regPassword: {required: true,minlength: 6,lettersAndNumbers: true},
			fullName: {required: true,lettersOnly: true},
			Email: {required: true,email: true},
			date: {required: true,},
			},
		messages: {
			regUserName: {required: "Enter user name",},
			fullName: {required: "Enter full name",},
			regPassword: {
				required: "Enter valid password",
				minlength: "Password most contain at least 6 characters"},
			Email: {required: "Enter valid email",},
			date: {required: "Enter birth date",}
		}
	})

	$('#Registerbtn').click(function () {
		if ($("#registerDetails").valid()) {
			store();
			changePage(settings);
		}
	});

	$('#setSubmit').click(function () {
		if ($("#settingDetails").valid()) {
			setGame();
		}
	});

	$('#settingDetails').validate({
		rules: {
			ballsNum: {required: true, numberOnly: true},
			gameTime: {required: true, time: true},
			upButton: {maxlength: 1,},
			downButton: {maxlength: 1,},
			rightButton: {maxlength: 1,},
			leftButton: {maxlength: 1,},
		},
		messages: {
			ballsNum: {required: "Enter number between 50 to 90",},
			gameTime: {required: "Enter number equal or longer than 60 sec",},
			upButton: {maxlength: "Enter only one char",},
			downButton: {maxlength: "Enter only one char",},
			leftButton: {maxlength: "Enter only one char",},
			rightButton: {maxlength: "Enter only one char",},
		}
	})

	$('#startNewGame').click(function () {
		window.clearInterval(interval1);
		window.clearInterval(interval2);
		sound.pause();
		changePage(settings);
	});

});


document.onkeydown = function(evt) {
    evt = evt || window.event;
    var keyCode = evt.keyCode;
    if (keyCode >= 37 && keyCode <= 40) {
        return false;
    }
};

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
	let storedPassword = localStorage.getItem(userName.value);
	if (userPassword.value == storedPassword) { // check Password in DB
		alert('logged in seccesfully!');
		ans = true;
	} else  {
		alert('Invalid details!');
		ans = false;
	}
	userName=userName.value;
	if (ans == true) {
		changePage(settings);
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
	isBonus = false;
	changePage(startGame);
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
	document.getElementById('upLabel').innerHTML = "Up: "+upChar;

	let downCharTemp = $("#downButton").val();
	if (downCharTemp != "") {
		downLabel.value = downCharTemp;
		downChar = downCharTemp;
	}
	document.getElementById('downLabel').innerHTML = "Down: "+downChar;

	let rightCharTemp = $("#rightButton").val();
	if (rightCharTemp != "") {
		rightLabel.value = rightCharTemp;
		rightChar = rightCharTemp;
	}
	document.getElementById('rightLabel').innerHTML = "Right: "+rightChar;

	let leftCharTemp = $("#leftButton").val();
	if (leftCharTemp != "") {
		leftLabel.value = leftCharTemp;
		leftChar = leftCharTemp;
	}
	document.getElementById('leftLabel').innerHTML = "Left: "+leftChar;

	// Num of Balls
	var ballsNum = $("#ballsNum").val();
	ballsLabel.value = ballsNum;
	document.getElementById('ballsLabel').innerHTML = "Number Of Balls: "+ballsNum;
	
	// Time of Game
	gameTime = parseInt($("#gameTime").val());
	timeLabel.value = gameTime;
	document.getElementById('timeLabel').innerHTML = "Game Time: "+gameTime;

	// Num of Monsters
	var monstersNum = $("#monstersNum").val();
	monstersLabel.value = monstersNum;
	document.getElementById('monstersLabel').innerHTML = "Number Of Ghosts: "+monstersNum;

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
	document.getElementById('userNameLabel').innerHTML = "User Name: "+ userName;

	// sanding all input to start func
	Start(upBtn, downBtn, leftBtn, rightBtn, ballsNum, gameTime, monstersNum);

}

  

function Start(upBtn, downBtn, leftBtn, rightBtn, ballsNum, gameTime, monstersNum) {
	window.clearInterval(interval1);
	window.clearInterval(interval2);

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
	monster1Image.src = "Images/monster1.png";
	monster2Image = new Image();
	monster2Image.src = "Images/monster2.png";
	monster3Image = new Image();
	monster3Image.src = "Images/monster3.png";
	monster4Image = new Image();
	monster4Image.src = "Images/monster4.png";

	// Wall image
	wallImage = new Image();
	wallImage.src = "Images/wall.jpg";

	// bonus image
	bonusImage = new Image();
	bonusImage.src = "Images/cupcake.png";

	// pill image
	pillImage = new Image();
	pillImage.src = "Images/pill3.png";

	// clock image
	clockImage = new Image();
	clockImage.src = "Images/clock.png";

	board = new Array();
	if (ballsNum>=85){
		ballsNum = 85;
	}
	ballsFirstNum = ballsNum;
	sound.play();
	score = 0;
	var ball_5 = Math.floor(ballsNum*0.6);
	var ball_15 = Math.floor(ballsNum*0.3);
	var ball_25 = ballsNum-ball_5-ball_15;
	gameTime = gameTime;
	pac_color = "yellow";
	var cnt = 144; // size of board
	var food_remain = ballsNum; // num of dots
	var monster_remain = monstersNum; // num of monster
	numOfMonster = monstersNum;
	var pacman_remain = 1; 
	startTime = new Date();
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
				
			} else if (i == 5 && j == 5){
				bonus.i = i;
				bonus.j = j;
				board[i][j] = 50;
				} 
			
			else {
					board[i][j] = 0;
				}
		}
	}
	var pillCell = findRandomEmptyCell(board);
	board[pillCell[0]][pillCell[1]] = 10;
	pill.i = pillCell[0];
	pill.j = pillCell[1];

	var clockCell = findRandomEmptyCell(board);
	board[clockCell[0]][clockCell[1]] = 20;
	clock.i = clockCell[0];
	clock.j = clockCell[1];

	while (pacman_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 2;
		pac.i = emptyCell[0];
		pac.j = emptyCell[1];
		pacman_remain--;
	}
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
		if (monster_remain == 1){
			board[1][1] = 6;
			monster1.i = 1;
			monster1.j = 1;}
		if (monster_remain == 2){
			board[1][10] = 7;
			monster2.i = 1;
			monster2.j = 10;}
	    if (monster_remain == 3){
			board[10][10] = 8;
			monster3.i = 10;
			monster3.j = 10;}
		if (monster_remain == 4){
			board[10][1] = 9;
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

	interval1 = setInterval(function () { UpdatePosition(upBtn, downBtn, leftBtn, rightBtn); }, 150);
	interval2 = setInterval(MonsterPosition, 550);

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

function GetKeyPressed(upBtn, downBtn, leftBtn, rightBtn) {
	if (keysDown[upBtn]) {
		return 1;
	}
	if (keysDown[downBtn]) {
		return 2;
	}
	if (keysDown[leftBtn]) {
		return 3;
	}
	if (keysDown[rightBtn]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value =  time_elapsed;
	lblLive.value = Live;

	for (var i = 0; i < 12; i++) {
		for (var j = 0; j < 12; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				if (KeyPressedPacImg==1){ // Packmen
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
			} else if (board[i][j] == 5) { // ball 5 point
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = Color5;
				context.fill();
			} else if (board[i][j] == 15) { // ball 15 point
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = Color15; 
				context.fill();
			} else if (board[i][j] == 25) { // ball 25 point
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = Color25; 
				context.fill();
			} else if (board[i][j] == 6) { // Monster1
				context.drawImage(monster1Image, center.x-30, center.y-30 ,60,60);
			} else if (board[i][j] == 7) { // Monster2
				context.drawImage(monster2Image, center.x-30, center.y-30 ,60,60);
			} else if (board[i][j] == 8) { // Monster3
				context.drawImage(monster3Image, center.x-30, center.y-30 ,60,60);
			} else if (board[i][j] == 9) { // Monster4
				context.drawImage(monster4Image, center.x-30, center.y-30 ,60,60);
			}
			 else if (board[i][j] == 4) { // Wall
				context.drawImage(wallImage, center.x-30, center.y-30 ,60,60);
			}

			else if (board[i][j] == 50) { // Bonus
				context.drawImage(bonusImage, center.x-30, center.y-30 ,60,60);
			}

			else if (board[i][j] == 10) { // pill
				context.drawImage(pillImage, center.x-30, center.y-30 ,45,45);
			}

			else if (board[i][j] == 20) { // clock
				context.drawImage(clockImage, center.x-20, center.y-30 ,40,50);
			}
		}
	}
}

function UpdatePosition(upBtn, downBtn, leftBtn, rightBtn) {
	board[pac.i][pac.j] = 0;
	var x = GetKeyPressed(upBtn, downBtn, leftBtn, rightBtn);
	if (x == 1) {
		if (pac.j > 0 && board[pac.i][pac.j - 1] != 4) { 
			pac.j--;
		}
	}
	if (x == 2) {
		if (pac.j < 10 && board[pac.i][pac.j + 1] != 4) {
			pac.j++;
		}
	}
	if (x == 3) {
		if (pac.i > 0 && board[pac.i - 1][pac.j] != 4) {
			pac.i--;
		}
	}
	if (x == 4) {
		if (pac.i < 10 && board[pac.i + 1][pac.j] != 4) {
			pac.i++;
		}
	}

	if(pac.i == bonus.i && pac.j == bonus.j){ //found bonus
		eatSound.play();
		isBonus = true;
		score = score + 50;
		board[bonus.i][bonus.j] = bonusLastPos;
		bonus.i = 0;
		bonus.j = 0;
	}

	if (isBonus == false){
			UpdateBonusPosition() 
	}

	if(pac.i == pill.i && pac.j == pill.j){ // found pill
		eatSound.play();
		Live ++;
		board[pill.i][pill.j] = 0;
		pill.i = 0;
		pill.j = 0;
	}

	if((pac.i == monster1.i && pac.j == monster1.j) ||  // found monster
	(pac.i == monster2.i && pac.j == monster2.j) || 
	(pac.i == monster3.i && pac.j == monster3.j) || 
	(pac.i == monster4.i && pac.j == monster4.j)){
		dieSound.play();
		Live--;
		score = score - 10;
		if (Live == 0){
			alert("Loser!");
			sound.pause();
			window.clearInterval(interval1);
			window.clearInterval(interval2);
		 }
		 else{
			afterDie() 
		 }
	}

	if (board[pac.i][pac.j] == 5) {
		ballsFirstNum --;
		score = score + 5;
	}
	if (board[pac.i][pac.j] == 15) {
		ballsFirstNum --;
		score = score + 15;
	}
	if (board[pac.i][pac.j] == 25) {
		ballsFirstNum --;
		score = score + 25;
	}

	board[pac.i][pac.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - startTime) / 1000;

	if (pac.i == clock.i && pac.j == clock.j){ // found clock
		eatSound.play();
		gameTime = gameTime + 20;
		lblTime.value = gameTime;
		document.getElementById('timeLabel').innerHTML = "Game Time: " + gameTime;
		isClock = true;
		board[clock.i][clock.j] = 0;
		clock.i = 0;
		clock.j = 0;
		
	}
	if (isClock == false){
		if (gameTime < time_elapsed){
			window.clearInterval(interval1);
			window.clearInterval(interval2);
			if ( score < 100){
				alert("You are better than " + score + " points!");
				sound.pause();
			}
			else{
				alert("Winner!!!");
				sound.pause();
				window.clearInterval(interval1);
				window.clearInterval(interval2);
			}
		}
	}
	else {
		if (gameTime+20 < time_elapsed){
			window.clearInterval(interval1);
			window.clearInterval(interval2);
			if ( score < 100){
				alert("You are better than " + score + " points!");
				sound.pause();
			}
			else{
				alert("Winner!!!");
				sound.pause();
				window.clearInterval(interval1);
				window.clearInterval(interval2);
			}
		}


	}
	// pac Image dir
	if (x != null){
		KeyPressedPacImg=x;
	}

	// Finished all balls
	if (ballsFirstNum <= 0 ){
		window.clearInterval(interval1);
		window.clearInterval(interval2);
		alert("Winner!!!");
		sound.pause();
	}
	else{
		Draw();
	}
}

function MonsterPosition() {
	monsters = [monster1,monster2,monster3,monster4]
	for (var i = 0; i < numOfMonster ; i++) {

		UpdateMonsterPosition(monsters[i], i+1);
	
	}

}
function UpdateMonsterPosition(monster1, num) {
	
	moves =new Array();
	var move1 = board[monster1.i][monster1.j - 1];
	if (monster1.j > 0 && move1 != 4 && move1 != 6 && move1 != 7 && move1 != 8 && move1 != 9 && move1 != 50) { 
		moves.push([monster1.i,monster1.j-1])
	}
	var move2 = board[monster1.i][monster1.j + 1];
	if (monster1.j < 10 && move2 != 4 && move2 != 6 && move2 != 7 && move2 != 8 && move2 != 9 && move2 != 50) {
		moves.push([monster1.i,monster1.j+1])
	}
	var move3 = board[monster1.i - 1][monster1.j];
	if (monster1.i > 0 && move3 != 4 && move3 != 6 && move3 != 7 && move3 != 8 && move3 != 9 && move3 != 50) {
		moves.push([monster1.i-1,monster1.j])
	}
	var move4 = board[monster1.i + 1][monster1.j];
	if (monster1.i < 10 && move4 != 4 && move4 != 6 && move4 != 7 && move4 != 8 && move4 != 9 && move4 != 50) {
		moves.push([monster1.i+1,monster1.j])
	}
	var minDis = 100; 
	var curMove = [];

	// pick move closest to pacman
	for (var i = 0; i < moves.length ; i++) {
		
		monsterI = moves[i][0];
		monsterJ = moves[i][1];
		var disFromPac = (Math.abs(monsterI-pac.i))+(Math.abs(monsterJ-pac.j));
		if (disFromPac < minDis){
			minDis = disFromPac;
			curMove = moves[i];
		}
	}

	var nextMove = board[curMove[0]][curMove[1]];
	if (num==1){
		board[monster1.i][monster1.j] = monster1LastPos;
		if(nextMove == 0 || nextMove == 5 || nextMove == 15 || nextMove == 25|| nextMove == 10|| nextMove == 20){
			monster1LastPos = board[curMove[0]][curMove[1]];
		}
		monster1.i = curMove[0];
		monster1.j = curMove[1];
		board[monster1.i][monster1.j] = 6;
	}
	if (num==2){
		board[monster1.i][monster1.j] = monster2LastPos;
		if(nextMove == 0 || nextMove == 5 || nextMove == 15 || nextMove == 25|| nextMove == 10|| nextMove == 20){
			monster2LastPos = board[curMove[0]][curMove[1]];
		}
		monster2.i = curMove[0];
		monster2.j = curMove[1];
		board[monster2.i][monster2.j] = 7;
	}
	if (num==3){
		board[monster1.i][monster1.j] = monster3LastPos;
		if(nextMove == 0 || nextMove == 5 || nextMove == 15 || nextMove == 25|| nextMove == 10|| nextMove == 20){
			monster3LastPos = board[curMove[0]][curMove[1]];
		}
		monster3.i = curMove[0];
		monster3.j = curMove[1];
		board[monster3.i][monster3.j] = 8;
	}
	if (num==4){
		board[monster1.i][monster1.j] = monster4LastPos;
		if(nextMove == 0 || nextMove == 5 || nextMove == 15 || nextMove == 25|| nextMove == 10|| nextMove == 20){
			monster4LastPos = board[curMove[0]][curMove[1]];
		}
		monster4.i = curMove[0];
		monster4.j = curMove[1];
		board[monster4.i][monster4.j] = 9;
	}

}

function UpdateBonusPosition() {
	
	let rnd = Math.floor(Math.random() * 4)+1;
	var nextMove;
	board[bonus.i][bonus.j] = bonusLastPos;

	if( rnd == 1){
		var move1 = board[bonus.i][bonus.j - 1];
		if (bonus.j > 0 && move1 != 4 && move1 != 6 && move1 != 7 && move1 != 8 && move1 != 9) { 
			nextMove = board[bonus.i][bonus.j-1];
			bonus.i = bonus.i;
			bonus.j = bonus.j-1;
		}
	}
	if( rnd == 2){
		var move2 = board[bonus.i][bonus.j + 1];
		if (bonus.j < 10 && move2 != 4 && move2 != 6 && move2 != 7 && move2 != 8 && move2 != 9) {
			nextMove = board[bonus.i][bonus.j+1];
			bonus.i = bonus.i;
			bonus.j = bonus.j+1;
		}
	}
	if( rnd == 3){
		var move3 = board[bonus.i - 1][bonus.j];
		if (bonus.i > 0 && move3 != 4 && move3 != 6 && move3 != 7 && move3 != 8 && move3 != 9) {
			nextMove = board[bonus.i-1][bonus.j];
			bonus.i = bonus.i-1;
			bonus.j = bonus.j;
		}
	}
	if( rnd == 4){
		var move4 = board[bonus.i + 1][bonus.j];
		if (bonus.i < 10 && move4 != 4 && move4 != 6 && move4 != 7 && move4 != 8 && move4 != 9) {
			nextMove = board[bonus.i+1][bonus.j];
			bonus.i = bonus.i+1;
			bonus.j = bonus.j;		
		}
	}

	if(nextMove == 0 || nextMove == 5 || nextMove == 15 || nextMove == 25|| nextMove == 10|| nextMove == 20){
		bonusLastPos = nextMove;
	}
	board[bonus.i][bonus.j] = 50;
	
}

// drow monsters in corner and pac rand
function afterDie(){

	let countMunster = numOfMonster;
	while (countMunster > 0) {
		if (countMunster == 1){
			board[monster1.i][monster1.j] = monster1LastPos;
			board[1][1] = 6;
			monster1.i = 1;
			monster1.j = 1;
			monster1LastPos = 0;}
		if (countMunster == 2){
			board[monster2.i][monster2.j] = monster2LastPos;
			board[1][10] = 7;
			monster2.i = 1;
			monster2.j = 10;
			monster2LastPos = 0;}
	    if (countMunster == 3){
			board[monster3.i][monster3.j] = monster3LastPos;
			board[10][10] = 8;
			monster3.i = 10;
			monster3.j = 10;
			monster3LastPos = 0;}
		if (countMunster == 4){
			board[monster4.i][monster4.j] = monster4LastPos;
			board[10][1] = 9;
			monster4.i = 10;
			monster4.j = 1
			monster4LastPos = 0;}
		countMunster--;
	}
	board[pac.i][pac.j] = 0;

	var emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = 2;
	pac.i = emptyCell[0];
	pac.j = emptyCell[1];

}


function changePage(page) {
	window.clearInterval(interval1);
	window.clearInterval(interval2);
	sound.pause();
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
