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
}


function drawFrame(frame) {
	//Nothing for now
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
	dx = robotSize * Math.cos(orien)
	dy = robotSize * Math.sin(orien)
	front = [pos[0] + dx, pos[1] + dy]

	backLeftAngle = orien + Math.PI - robotMarkerTriangleAngle;
	dx = robotSize * Math.cos(backLeftAngle);
	dy = robotSize * Math.sin(backLeftAngle);
	backLeft = [pos[0] + dx, pos[1] + dy];

	backRightAngle = orien + Math.PI + robotMarkerTriangleAngle;
	dx = robotSize * Math.cos(backRightAngle);
	dy = robotSize * Math.sin(backRightAngle);
	backRight = [pos[0] + dx, pos[1] + dy];
	
	ctx.beginPath();
	ctx.moveTo(front[0], front[1]);
	ctx.lineTo(backLeft[0], backLeft[1]);
	ctx.lineTo(backRight[0], backRight[1]);
	ctx.lineTo(front[0], front[1]);
	ctx.stroke();
}

///////////////////////////////////////////
/// EXECUTED CODE
///////////////////////////////////////////

setup()