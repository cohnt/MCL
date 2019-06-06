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

var vizDrawLidar = true;
var vizDrawParticles = true;

var numParticles = 500;
var particlePosNoiseVariance = 5;
var particleOrientationNoiseVariance = 15 * (Math.PI / 180);
var explorationFactor = 0.01; //0.0 means no particles are randomly placed for exploration, 0.5 means 50%, 1.0 means 100%
var useExplorationParticlesGuess = false; //Whether or not to use exploration particles when estimating mouse location.

var particleDispRadius = 3;
var particleDispHeadingLength = 8; //Length of the direction marker for each particle
var errorWeightColorDivisor = 300;
var weightColorMultiplier = 0.9;

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
var particles = []; //Array of the particles used for the filter

///////////////////////////////////////////
/// CLASSES
///////////////////////////////////////////

function Particle(pos=[0,0], orien=0) {
	this.pos = pos.slice();
	this.orien = orien;
	this.weight = 0;
	this.lidarReadings = new Array(lidarNumPoints).fill(0);
	this.isExploration = false;

	this.randomize = function() {
		this.pos = [Math.random() * canvasSize[0], Math.random() * canvasSize[1]];
		this.orien = Math.random() * 2 * Math.PI - Math.PI;
		this.isExploration = true;
	}
}
function Frame(id, particles_in, robotPos_in, robotOrien_in, lidarDistances_in) {
	this.id = id;
	this.particles = particles_in.slice();
	this.robotPos = robotPos_in.slice();
	this.robotOrien = robotOrien_in;
	this.lidarDistances = lidarDistances_in
	this.guessPos = [0, 0]; // TODO

	this.maxNormalizedIndex = 0;
	this.maxNormalizedWeight = this.particles[this.maxNormalizedIndex].weight;
	for(var i=1; i<this.particles.length; ++i) {
		if(particles[i].weight > this.maxNormalizedWeight) {
			this.maxNormalizedIndex = i;
			this.maxNormalizedWeight = this.particles[this.maxNormalizedIndex].weight;
		}
	}
	var maxError = Math.pow(Math.E, -1*dist2(this.robotPos, this.particles[this.maxNormalizedIndex].pos))
		+ Math.pow(Math.E, -1*angleDist(this.mouseOrien, this.particles[this.maxNormalizedIndex].heading));
	this.frameColorMultiplier = maxError * weightColorMultiplier;

	this.log = function() {
		var row = document.createElement("tr");

		function addCell(row, contents) {
			var eltCont = document.createElement("td");
			var eltText = document.createTextNode(contents);
			eltCont.appendChild(eltText);
			eltCont.style.padding = "2px 8px";
			row.appendChild(eltCont);
		}

		var error = Math.sqrt(dist2(this.robotPos, this.guessPos));

		addCell(row, "Frame " + this.id);
		addCell(row, " [ " + this.robotPos[0].toFixed(2) + ", " + this.robotPos[1].toFixed(2) + " ] ");
		addCell(row, " [ " + this.guessPos[0].toFixed(2) + ", " + this.guessPos[1].toFixed(2) + " ] ");
		addCell(row, error.toFixed(2));
		addCell(row, "");

		row.setAttribute("id", "frame" + this.id);
		row.lastChild.style.backgroundColor = errorColor(error);
		row.addEventListener("click", function() {
			if(running) {
				return;
			}
			currentFrame = this.id.slice(5);
			drawFrame(frames[currentFrame], true);

			currentFrameCont.error.scrollIntoView();
			window.scrollBy(0, -25);
		});

		frameListTableHeader.parentNode.insertBefore(row, frameListTableHeader.nextSibling);
	}

	this.showCurrent = function() {
		currentFrameCont.number.innerHTML = this.id;
		currentFrameCont.actualPos.innerHTML = " [ " + this.robotPos[0].toFixed(2) + ", " + this.robotPos[1].toFixed(2) + " ] ";
		currentFrameCont.guessPos.innerHTML = " [ " + this.guessPos[0].toFixed(2) + ", " + this.guessPos[1].toFixed(2) + " ] ";
		var error = Math.sqrt(dist2(this.robotPos, this.guessPos));
		currentFrameCont.error.innerHTML = error.toFixed(2);
		currentFrameCont.color.style.backgroundColor = errorColor(error);
	}
}

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

	document.getElementById("randomMazeButton").addEventListener("click", randomMazeClick);
	document.getElementById("maze1Button").addEventListener("click", maze1Click);
	document.getElementById("maze2Button").addEventListener("click", maze2Click);
	document.getElementById("maze3Button").addEventListener("click", maze3Click);

	document.getElementById("checkboxLIDAR").addEventListener("change", function() { vizDrawLidar = this.checked; });
	document.getElementById("checkboxParticles").addEventListener("change", function() { vizDrawParticles = this.checked; });

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
				if(!running) {
					if(currentFrame < frames.length-1) {
						++currentFrame;
					}
				}
				drawFrame(frames[currentFrame]);
				break;
			case 37: //Left arrow key
				if(!running) {
					if(currentFrame > 0) {
						--currentFrame;
					}
				}
				drawFrame(frames[currentFrame]);
				break;
			case 48: //0 key
				if(!running) {
					currentFrame = 0;
					drawFrame(frames[currentFrame]);
				}
				break;
			case 57: //9 key
				if(!running) {
					currentFrame = frames.length-1;
					drawFrame(frames[currentFrame]);
				}
				break;
			case 32: //spacebar
				if(running) {
					pauseButtonClick();
				}
				else {
					startButtonClick();
				}
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
		generateParticles();
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
		reset();
		drawFrame();
	}
}
function maze1Click() {
	if(!running) {
		currentMaze = maze1;
		currentMazeStart = maze1Start;
		reset();
		drawFrame();
	}
}
function maze2Click() {
	if(!running) {
		currentMaze = maze2;
		currentMazeStart = maze2Start;
		reset();
		drawFrame();
	}
}
function maze3Click() {
	if(!running) {
		currentMaze = maze3;
		currentMazeStart = maze3Start;
		reset();
		drawFrame();
	}
}

function tick() {
	if(stop) {
		running = false;
		stop = false;
		return;
	}

	updateRobotPos();
	lidarDistances = computeLidarDistances(robotPos, robotOrien);
	lidarDistances = noisifyLidar(lidarDistances);

	saveFrame();
	frames[frames.length-1].log();

	drawFrame(frames[frames.length-1]);

	window.setTimeout(tick, tickTime);
}
function reset() {
	robotPos = mazeIdxToCoord(currentMazeStart);
	robotPos[0] += 0.5 * mazeBoxWidth;
	robotPos[1] += 0.5 * mazeBoxHeight;
	robotOrien = 0;
	lidarDistances = new Array(lidarNumPoints).fill(0);
	particles = [];
	while(frameListTableHeader.nextSibling) {
		//Delete all children of frameListCont.
		frameListTableHeader.parentNode.removeChild(frameListTableHeader.nextSibling);
	}
	clearCanvas();
	drawMaze(currentMaze);
	drawRobot(robotPos, robotOrien);
}
function saveFrame() {
	var frame = new Frame(frames.length, particles, robotPos, robotOrien, lidarDistances);
	frames.push(frame);
}

function generateParticles() {
	for(var i=0; i<numParticles; ++i) {
		particles[i] = new Particle();
		particles[i].randomize();
	}
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
function computeLidarDistances(pos, orien) {
	var lidarVals = new Array(lidarNumPoints).fill(0);
	for(var lidarIdx=0; lidarIdx<lidarNumPoints; ++lidarIdx) {
		var robotFrameAngle = (-lidarFOV / 2) + (lidarIdx * lidarAngle);
		var x0 = pos[0];
		var y0 = pos[1];
		var globalFrameAngle = robotFrameAngle + orien;
		var dx = Math.cos(globalFrameAngle);
		var dy = Math.sin(globalFrameAngle);
		var mazeIdx = coordToMazeIdx(pos);
		var xSign = dx > 0 ? 1 : -1;
		var ySign = dy > 0 ? 1 : -1;
		if(isZero(dx)) {
			var i = mazeIdx[0];
			var j = mazeIdx[1];
			for(; i>=0 && i<canvasHeightBoxes; i+=(-ySign)) {
				if(currentMaze[i][j] == true) {
					var y1 = mazeIdxToCoord([i, j])[1];
					if(ySign == 1) {
						lidarVals[lidarIdx] = y1 - y0;
					}
					else {
						lidarVals[lidarIdx] = y0 - (y1 + mazeBoxHeight);
					}
					break;
				}
			}
			if(i == -1) {
				var y1 = canvasSize[1]
				lidarVals[lidarIdx] = y1 - y0;
			}
			else if(i == canvasHeightBoxes) {
				var y1 = 0;
				lidarVals[lidarIdx] = y0 - y1;
			}
		}
		else if(isZero(dy)) {
			var i = mazeIdx[0];
			var j = mazeIdx[1];
			for(; j>=0 && j<canvasWidthBoxes; j+=xSign) {
				if(currentMaze[i][j] == true) {
					var x1 = mazeIdxToCoord([i, j])[0];
					if(xSign == 1) {
						lidarVals[lidarIdx] = x1 - x0;
					}
					else {
						lidarVals[lidarIdx] = x0 - (x1 + mazeBoxWidth);
					}
					break;
				}
			}
			if(j == -1) {
				var x1 = 0;
				lidarVals[lidarIdx] = x0 - x1;
			}
			else if(j == canvasWidthBoxes) {
				var x1 = canvasSize[0]
				lidarVals[lidarIdx] = x1 - x0;
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
				lidarVals[lidarIdx] = nsDist;
			}
			else {
				lidarVals[lidarIdx] = ewDist;
			}
		}
	}
	return lidarVals;
}
function noisifyLidar(distances_in) {
	distances_out = distances_in.slice();
	for(var i=0; i<lidarNumPoints; ++i) {
		distances_out[i] += randomNormal(0, lidarNoiseVariance);
	}
	return distances_out
}
function isZero(val) {
	//
	return Math.abs(val) < 0.0000001
}

function drawFrame(frame) {
	clearCanvas();
	drawMaze(currentMaze);
	drawRobot(frame.robotPos, frame.robotOrien);
	if(vizDrawLidar) {
		drawLidar(frame.robotPos, frame.robotOrien, frame.lidarDistances);
	}
	if(vizDrawParticles) {
		for(var i=0; i<frame.particles.length; ++i) {
			drawParticle(frame.particles[i], frame.maxNormalizedWeight, frame.frameColorMultiplier);
		}
	}
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
function drawLidar(pos, orien, distances) {
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
function drawParticle(p, maxWeight, mult) {
	color = weightToColor(p.weight * mult / maxWeight);
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.moveTo(p.pos[0], p.pos[1]);
	ctx.arc(p.pos[0], p.pos[1], particleDispRadius, 0, 2*Math.PI, true);
	ctx.closePath();
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(p.pos[0], p.pos[1]);
	ctx.lineTo(p.pos[0] + (particleDispHeadingLength*Math.cos(p.orien)),
		p.pos[1] + (particleDispHeadingLength*Math.sin(p.orien)));
	ctx.stroke();
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

function randomNormal(mean, variance) {
	var u1 = Math.random();
	var u2 = Math.random();
	var z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
	return mean + (z0 * variance);
}
function weightToColor(weight) {
	if(weight > 1) {
		weight = 1;
	}

	//Create HSL
	var h = ((1-weight)*240)/360;
	var s = 1;
	var l = 0.5;

	//Convert to RGB (from https://gist.github.com/mjackson/5311256)
	var r, g, b;

	function hue2rgb(p, q, t) {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1/6) return p + (q - p) * 6 * t;
		if (t < 1/2) return q;
		if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
		return p;
	}

	var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	var p = 2 * l - q;

	r = hue2rgb(p, q, h + 1/3);
	g = hue2rgb(p, q, h);
	b = hue2rgb(p, q, h - 1/3);

	r = Math.floor(r * 255);
	g = Math.floor(g * 255);
	b = Math.floor(b * 255);

	//Convert to RGB color code
	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}
	function rgbToHex(r, g, b) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}

	return rgbToHex(r, g, b);
}
function errorColor(error) {
	var errorWeight = error / errorWeightColorDivisor;
	if(errorWeight < 0) { errorWeight = 0; }
	if(errorWeight > 1) { errorWeight = 1; }
	errorWeight = 1 - errorWeight;
	return weightToColor(errorWeight);
}
function dist2(a, b) {
	var dx = b[0]-a[0];
	var dy = b[1]-a[1];
	return (dx*dx) + (dy*dy);
}
function angleDist(a, b) {
	var diff = a - b;
	function specialMod(lhs, rhs) {
		return lhs - (Math.floor(lhs/rhs) * rhs);
	}
	return (specialMod(diff + Math.PI, Math.PI*2)) - Math.PI;
}

///////////////////////////////////////////
/// EXECUTED CODE
///////////////////////////////////////////

setup()