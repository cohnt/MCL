///////////////////////////////////////////
/// CONSTANTS
///////////////////////////////////////////

var mazeBoxWidth = 60; //Height of each maze box, in pixels
var mazeBoxHeight = 60; //Width of each maze box, in pixels
var mazeBoxSize = [mazeBoxWidth, mazeBoxHeight]; //Computed box size
var canvasWidthBoxes = 15; //Number of boxes horizontally in the canvas
var canvasHeightBoxes = 10; //Number of boxes vertically in the canvas
var canvasSize = [canvasWidthBoxes*mazeBoxWidth, canvasHeightBoxes*mazeBoxHeight]

var robotColor = "black";
var robotSize = 15; //Radius of the robot (in pixels)
var robotMarkerTriangleAngle = 30 * (Math.PI / 180); //The front angle of the triangular robot marker
var lidarBeamColor = "red";

var boxBorderColor = "black";
var boxFillColor = "#333333";

var randomMazeDensity = 1/3; // Fraction of blocks that are walls in a random maze
// https://www.researchgate.net/figure/18-An-example-of-a-simple-maze-created-using-a-WallMaker-that-makes-the-red-wall-parts_fig29_259979929
var maze1 = [ 
	// [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
	[0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
	[0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
	[0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
	[0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0],
	[1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
]; // This grid is exactly how it will appear
var maze1Start = [0, 0]; // The robot will start in the center of maze1[0][0]

// TODO
var maze2 = maze1;
var maze2Start = maze1Start;
var maze3 = maze1;
var maze3Start = maze1Start;

var tickRate = 25; // Ticks per second
var tickTime = 1000 / tickRate; // ms per tick

var robotSpeed = 60; // Robot speed, in pixels per second
var robotTurnRate = 90 * (Math.PI / 180); // Robot turn rate, in radians per second
var lidarNumPoints = 25; // Number of points given in each sweep of the lidar
var lidarFOV = 180 * (Math.PI / 180); // FOV of the lidar, in radians
var lidarAngle = lidarFOV / (lidarNumPoints - 1); // The angle between two lidar beams
var lidarNoiseVariance = 5; //The variance of the noise affecting the lidar measurements

///////////////////////////////////////////
/// GLOBAL VARIABLES
///////////////////////////////////////////

var canvas; // The html object for the canvas
var ctx; // The drawing context
var frameListCont; //T he html object for the div where frames and frame information is listed
var frameListTableHeader; // The html object for the header row of the frame list table
var currentFrameCont = {}; // Contains the html objects for the current frame display
var parameterElts = []; // Contains the html elements for the parameter text fields
var keyStates = {}; // Contains the status of every key on the keyboard
var frames = []; // An array of each frame, with all interesting information
var currentFrame = -1;
var currentMaze = maze1;
var currentMazeStart = maze1Start;
var hasStarted = false;
var running = false;
var stop = false;
var robotPos = [0, 0];
var robotOrien = 0;
var lidarDistances = [];

///////////////////////////////////////////
/// CLASSES
///////////////////////////////////////////


///////////////////////////////////////////
/// FUNCTIONS
///////////////////////////////////////////

function setup() {
	canvas = document.getElementById("canvas");
	canvas.setAttribute("width", String(canvasSize[0]) + "px");
	canvas.setAttribute("height", String(canvasSize[1]) + "px");

	frameListCont = document.getElementById("frameListCont");
	frameListTableHeader = document.getElementById("frameListTableHeader");

	currentFrameCont.number = document.getElementById("currentFrameNumber");
	currentFrameCont.actualPos = document.getElementById("currentFrameActual");
	currentFrameCont.guessPos = document.getElementById("currentFrameGuess");
	currentFrameCont.error = document.getElementById("currentFrameError");
	currentFrameCont.color = document.getElementById("currentFrameColor");

	document.getElementById("startButton").addEventListener("click", startButtonClick);
	document.getElementById("pauseButton").addEventListener("click", pauseButtonClick);
	document.getElementById("resetButton").addEventListener("click", resetButtonClick);

	document.getElementById("randomMazeButton").addEventListener("click", randomMazeClick)
	document.getElementById("maze1Button").addEventListener("click", maze1Click)
	document.getElementById("maze2Button").addEventListener("click", maze2Click)
	document.getElementById("maze3Button").addEventListener("click", maze3Click)

	var parElts = document.getElementsByClassName("parameterForm");
	for(var i=0; i<parElts.length; ++i) {
		parameterElts.push(parElts[i]);
	}

	document.addEventListener("keydown", function(e) {
		var keyId = e.which;
		keyStates[keyId] = true;
		console.log("Key down: " + keyId);
		switch(keyId) {
			case 39: //Right arrow key
				if(currentFrame < frames.length-1) {
					++currentFrame;
				}
				drawFrame(frames[currentFrame]);
				break;
			case 37: //Left arrow key
				if(currentFrame > 0) {
					--currentFrame;
				}
				drawFrame(frames[currentFrame]);
				break;
			case keyId == 48: //0 key
				currentFrame = 0;
				drawFrame(frames[currentFrame]);
				break;
			case keyId == 57: //9 key
				currentFrame = frames.length-1;
				drawFrame(frames[currentFrame]);
				break;
		}
	});
	document.addEventListener("keyup", function(e) {
		var keyId = e.which;
		keyStates[keyId] = false;
	})

	ctx = canvas.getContext("2d");
	ctx.transform(1, 0, 0, -1, 0, 0); // Flip the context so y+ is up
	ctx.transform(1, 0, 0, 1, 0, -canvasSize[1]); //Move 0,0 to the bottom left of the screen

	reset();
}

function startButtonClick() {
	if(!running && !hasStarted) {
		reset();
		running = true;
		hasStarted = true;
		tick();
	}
	else if(!running && hasStarted) {
		running = true;
		tick();
	}
}
function pauseButtonClick() {
	if(running) {
		stop = true;
	}
}
function resetButtonClick() {
	if(!running) {
		hasStarted = false;
		reset();
	}
}
function randomMazeClick() {
	if(!running) {
		generateRandomMaze();
	}
}
function maze1Click() {
	if(!running) {
		currentMaze = maze1;
		currentMazeStart = maze1Start;
	}
}
function maze2Click() {
	if(!running) {
		currentMaze = maze2;
		currentMazeStart = maze2Start;
	}
}
function maze3Click() {
	if(!running) {
		currentMaze = maze3;
		currentMazeStart = maze3Start;
	}
}

function tick() {
	if(stop) {
		running = false;
		stop = false;
		return;
	}

	updateRobotPos();
	updateLidar();
	noisifyLidar();

	drawFrame();

	window.setTimeout(tick, tickTime);
}
function reset() {
	robotPos = mazeIdxToCoord(currentMazeStart);
	robotPos[0] += 0.5 * mazeBoxWidth;
	robotPos[1] += 0.5 * mazeBoxHeight;
	robotOrien = 0;
	lidarDistances = new Array(lidarNumPoints).fill(0);
	drawFrame();
}

function updateRobotPos() {
	var upKey = 87; //W
	var leftKey = 65; //A
	var downKey = 83; //S
	var rightKey = 68; //D

	// !undefined == true, !!undefined == false
	if((!!keyStates[leftKey]) && !keyStates[rightKey]) {
		robotOrien += (tickTime / 1000) * robotTurnRate;
	}
	else if(!keyStates[leftKey] && (!!keyStates[rightKey])) {
		robotOrien -= (tickTime / 1000) * robotTurnRate;
	}

	if((!!keyStates[upKey]) && !keyStates[downKey]) {
		var dx = (tickTime / 1000) * robotSpeed * Math.cos(robotOrien);
		var dy = (tickTime / 1000) * robotSpeed * Math.sin(robotOrien);
		var newPos = [
			robotPos[0] + dx,
			robotPos[1] + dy
		];
		if(!isColliding(newPos)) {
			robotPos[0] += dx;
			robotPos[1] += dy;
		}
	}
	else if(!keyStates[upKey] && (!!keyStates[downKey])) {
		var dx = (tickTime / 1000) * robotSpeed * Math.cos(robotOrien);
		var dy = (tickTime / 1000) * robotSpeed * Math.sin(robotOrien);
		var newPos = [
			robotPos[0] - dx,
			robotPos[1] - dy
		];
		if(!isColliding(newPos)) {
			robotPos[0] -= dx;
			robotPos[1] -= dy;
		}
	}
}
function isColliding(pos) {
	var currentMazeIdx = coordToMazeIdx(pos);
	var i = currentMazeIdx[0];
	var j = currentMazeIdx[1];
	return currentMaze[i][j] == true;
}
function updateLidar() {
	for(var lidarIdx=0; lidarIdx<lidarNumPoints; ++lidarIdx) {
		var robotFrameAngle = (-lidarFOV / 2) + (lidarIdx * lidarAngle);
		var x0 = robotPos[0];
		var y0 = robotPos[1];
		var globalFrameAngle = robotFrameAngle + robotOrien;
		var dx = Math.cos(globalFrameAngle);
		var dy = Math.sin(globalFrameAngle);
		var mazeIdx = coordToMazeIdx(robotPos);
		var xSign = dx > 0 ? 1 : -1;
		var ySign = dy > 0 ? 1 : -1;
		if(isZero(dx)) {
			var i = mazeIdx[0];
			var j = mazeIdx[1];
			for(; i>=0 && i<canvasHeightBoxes; i+=(-ySign)) {
				if(currentMaze[i][j] == true) {
					var y1 = mazeIdxToCoord([i, j])[1];
					if(ySign == 1) {
						lidarDistances[lidarIdx] = y1 - y0;
					}
					else {
						lidarDistances[lidarIdx] = y0 - (y1 + mazeBoxHeight);
					}
					break;
				}
			}
			if(i == -1) {
				var y1 = canvasSize[1]
				lidarDistances[lidarIdx] = y1 - y0;
			}
			else if(i == canvasHeightBoxes) {
				var y1 = 0;
				lidarDistances[lidarIdx] = y0 - y1;
			}
		}
		else if(isZero(dy)) {
			var i = mazeIdx[0];
			var j = mazeIdx[1];
			for(; j>=0 && j<canvasWidthBoxes; j+=xSign) {
				if(currentMaze[i][j] == true) {
					var x1 = mazeIdxToCoord([i, j])[0];
					if(xSign == 1) {
						lidarDistances[lidarIdx] = x1 - x0;
					}
					else {
						lidarDistances[lidarIdx] = x0 - (x1 + mazeBoxWidth);
					}
					break;
				}
			}
			if(j == -1) {
				var x1 = 0;
				lidarDistances[lidarIdx] = x0 - x1;
			}
			else if(j == canvasWidthBoxes) {
				var x1 = canvasSize[0]
				lidarDistances[lidarIdx] = x1 - x0;
			}
		}
		else {
			// First, get the shortest distance hitting a north-south wall
			var nsDist = Infinity;
			var i = mazeIdx[0];
			var j = mazeIdx[1] + xSign;
			for(; j>=0 && j<canvasWidthBoxes; j+=xSign) {
				var xComputed = mazeIdxToCoord([0, j])[0];
				if(xSign == -1) {
					xComputed += mazeBoxWidth;
				}
				var yComputed = y0 + ((xComputed - x0) * (dy/dx));
				if(yComputed < 0 || yComputed >= canvasSize[1]) {
					nsDist = Infinity;
					break;
				}
				i = coordToMazeIdx([xComputed, yComputed])[0];
				if(currentMaze[i][j] == true) {
					var horiz = xComputed - x0;
					var vert = yComputed - y0;
					nsDist = Math.sqrt((horiz)*(horiz) + (vert)*(vert));
					break;
				}
			}
			if(j == -1) {
				var xComputed = 0;
				var yComputed = y0 + ((xComputed - x0) * (dy/dx));
				var horiz = xComputed - x0;
				var vert = yComputed - y0;
				nsDist = Math.sqrt((horiz)*(horiz) + (vert)*(vert));
			}
			else if(j == canvasWidthBoxes) {
				var xComputed = canvasSize[0];
				var yComputed = y0 + ((xComputed - x0) * (dy/dx));
				var horiz = xComputed - x0;
				var vert = yComputed - y0;
				nsDist = Math.sqrt((horiz)*(horiz) + (vert)*(vert));
			}

			// Now, get the shortest distance hitting an east-west wall
			var ewDist = Infinity;
			var i = mazeIdx[0] + (-ySign);
			var j = mazeIdx[1];
			for(; i>=0 && i<canvasHeightBoxes; i+=(-ySign)) {
				var yComputed = mazeIdxToCoord([i, 0])[1];
				if(ySign == -1) {
					yComputed += mazeBoxHeight;
				}
				var xComputed = x0 + ((yComputed - y0) * (dx/dy));
				if(xComputed < 0 || xComputed >= canvasSize[0]) {
					ewDist = Infinity;
					break;
				}
				j = coordToMazeIdx([xComputed, yComputed])[1];
				if(currentMaze[i][j] == true) {
					var horiz = xComputed - x0;
					var vert = yComputed - y0;
					ewDist = Math.sqrt((horiz)*(horiz) + (vert)*(vert));
					break;
				}
			}
			if(i == -1) {
				var yComputed = canvasSize[1];
				var xComputed = x0 + ((yComputed - y0) * (dx/dy));
				var horiz = xComputed - x0;
				var vert = yComputed - y0;
				ewDist = Math.sqrt((horiz)*(horiz) + (vert)*(vert));
			}
			else if(i == canvasHeightBoxes) {
				var yComputed = 0;
				var xComputed = x0 + ((yComputed - y0) * (dx/dy));
				var horiz = xComputed - x0;
				var vert = yComputed - y0;
				ewDist = Math.sqrt((horiz)*(horiz) + (vert)*(vert));
			}

			if(nsDist < ewDist) {
				lidarDistances[lidarIdx] = nsDist;
			}
			else {
				lidarDistances[lidarIdx] = ewDist;
			}
		}
	}
}
function noisifyLidar() {
	for(var i=0; i<lidarNumPoints; ++i) {
		var u1 = Math.random();
		var u2 = Math.random();
		var z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
		lidarDistances[i] += (z0 * lidarNoiseVariance);
	}
}
function isZero(val) {
	//
	return Math.abs(val) < 0.0000001
}

function drawFrame(frame) {
	clearCanvas();
	drawMaze(currentMaze);
	drawRobot(robotPos, robotOrien);
	drawLidar(lidarDistances);
}
function clearCanvas() {
	//
	ctx.clearRect(0, 0, canvasSize[0], canvasSize[1]);
}
function drawBox(gridPos, filled) {
	var x0 = gridPos[0] * mazeBoxWidth;
	var y0 = gridPos[1] * mazeBoxHeight;
	var dx = mazeBoxWidth;
	var dy = mazeBoxHeight;
	ctx.strokeStyle = boxBorderColor;
	ctx.beginPath();
	ctx.rect(x0, y0, dx, dy);
	ctx.stroke();
	if(filled) {
		ctx.fillStyle = boxFillColor;
		ctx.fillRect(x0, y0, dx, dy);
	}
}
function drawRobot(pos, orien) {
	// orien should be in radians
	ctx.strokeStyle = robotColor;

	// Draw the outer circle
	ctx.beginPath();
	ctx.moveTo(pos[0] + robotSize, pos[1]);
	ctx.arc(pos[0], pos[1], robotSize, 0, 2*Math.PI, true);
	ctx.stroke();

	// Draw a triangle showing orientation
	var dx = robotSize * Math.cos(orien)
	var dy = robotSize * Math.sin(orien)
	var front = [pos[0] + dx, pos[1] + dy]

	var backLeftAngle = orien + Math.PI - robotMarkerTriangleAngle;
	dx = robotSize * Math.cos(backLeftAngle);
	dy = robotSize * Math.sin(backLeftAngle);
	var backLeft = [pos[0] + dx, pos[1] + dy];

	var backRightAngle = orien + Math.PI + robotMarkerTriangleAngle;
	dx = robotSize * Math.cos(backRightAngle);
	dy = robotSize * Math.sin(backRightAngle);
	var backRight = [pos[0] + dx, pos[1] + dy];
	
	ctx.beginPath();
	ctx.moveTo(front[0], front[1]);
	ctx.lineTo(backLeft[0], backLeft[1]);
	ctx.lineTo(backRight[0], backRight[1]);
	ctx.lineTo(front[0], front[1]);
	ctx.stroke();
}
function drawMaze(maze) {
	for(var i=0; i<maze.length; ++i) {
		for(var j=0; j<maze[i].length; ++j) {
			var x = j;
			var y = (maze.length-1) - i
			drawBox([x, y], maze[i][j])
		}
	}
}
function drawLidar(distances) {
	// Note: distances.length == lidarNumPoints
	for(var i=0; i<lidarNumPoints; ++i) {
		var robotFrameAngle = (-lidarFOV / 2) + (i * lidarAngle);
		var globalFrameAngle = robotFrameAngle + robotOrien;
		var dx = distances[i] * Math.cos(globalFrameAngle);
		var dy = distances[i] * Math.sin(globalFrameAngle);

		ctx.strokeStyle = lidarBeamColor;
		ctx.beginPath();
		ctx.moveTo(robotPos[0], robotPos[1]);
		ctx.lineTo(robotPos[0] + dx, robotPos[1] + dy);
		ctx.stroke();
	}
}

function generateRandomMaze() {
	var maze = []
	for(var i=0; i<canvasHeightBoxes; ++i) {
		maze[i] = []
		for(var j=0; j<canvasWidthBoxes; ++j) {
			maze[i][j] = (Math.random() < randomMazeDensity);
		}
	}
	var mazeStart = [0, 0];
	do {
		mazeStart[0] = Math.floor(Math.random() * canvasHeightBoxes)
		mazeStart[1] = Math.floor(Math.random() * canvasWidthBoxes)
	}
	while(maze[mazeStart[0]][mazeStart[1]] == true);
	currentMaze = maze;
	currentMazeStart = mazeStart;
}
function mazeIdxToCoord(idx) {
	var i = idx[0];
	var j = idx[1];
	var x = j * mazeBoxWidth;
	var y = ((canvasHeightBoxes-1) - i) * mazeBoxHeight;
	return [x, y];
}
function coordToMazeIdx(coord) {
	var x = coord[0];
	var y = coord[1];
	var i = (canvasHeightBoxes-1) - Math.floor(y / mazeBoxHeight);
	var j = Math.floor(x / mazeBoxWidth);
	return [i, j]
}

///////////////////////////////////////////
/// EXECUTED CODE
///////////////////////////////////////////

setup()