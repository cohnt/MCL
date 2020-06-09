///////////////////////////////////////////
/// CONSTANTS
///////////////////////////////////////////

var mazeBoxWidth = 60; //Height of each maze box, in pixels
var mazeBoxHeight = 60; //Width of each maze box, in pixels
var mazeBoxSize = [mazeBoxWidth, mazeBoxHeight]; //Computed box size
var canvasWidthBoxes = 15; //Number of boxes horizontally in the canvas
var canvasHeightBoxes = 10; //Number of boxes vertically in the canvas
var canvasSize = [canvasWidthBoxes*mazeBoxWidth, canvasHeightBoxes*mazeBoxHeight] //This is the size of the canvas in pixels

var robotColor = "black";
var robotSize = Math.min(mazeBoxWidth, mazeBoxHeight) / 4; //Radius of the robot (in pixels). This ensures that the robot can easily fit within a single box.
var robotMarkerTriangleAngle = 30 * (Math.PI / 180); //The front angle of the triangular robot marker
var lidarBeamColor = "red";

var boxBorderColor = "black";
var boxFillColor = "#333333"; //This is a hex color code -- the format is #RRGGBB.
                              //This tool is helpful for picking colors: https://www.w3schools.com/colors/colors_picker.asp

var randomMazeDensity = 1/3; // Fraction of blocks that are walls in a random maze
// https://www.researchgate.net/figure/18-An-example-of-a-simple-maze-created-using-a-WallMaker-that-makes-the-red-wall-parts_fig29_259979929
var maze1 = [ 
	[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	[0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
	[0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
	[0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
	[0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
	[1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
	[0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1],
	[1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
]; // This grid is exactly how it will appear. 0s are empty, 1s are walls.
var maze1Start = [0, 0]; // The robot will start in the center of maze1[0][0]
var maze2 = [
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0],
	[1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0],
	[0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
	[1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0],
	[0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
	[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0],
	[0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0],
	[0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0],
]
var maze2Start = [8, 2];
var maze3 = [
	[1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0],
	[0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0],
	[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0],
	[0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
	[0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
	[0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1],
	[0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
	[1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0],
]
var maze3Start = [2, 2];

var tickRate = 25; // Ticks per second
var tickTime = 1000 / tickRate; // ms per tick

var robotSpeed = 60; // Robot speed, in pixels per second
var robotTurnRate = 90 * (Math.PI / 180); // Robot turn rate, in radians per second
var lidarNumPoints = 25; // Number of points given in each sweep of the lidar
var lidarFOV = 180 * (Math.PI / 180); // FOV of the lidar, in radians
var lidarAngle = lidarFOV / (lidarNumPoints - 1); // The angle between two lidar beams
var lidarNoiseVariance = 5; //The variance of the noise affecting the lidar measurements.

var vizDrawLidar = true; //If true, draw the lidar scans from the robot.
var vizDrawParticles = true; //If true, draw the all of the estimates.
var vizParticleLIDAR = false; //If true, draw the guessed lidar for each estimate.

var numParticles = 500; //Number of samples to use for the particle filter.
var particlePosNoiseVariance = 5; //The variance of the diffusion noise added to the position during resampling.
var particleOrientationNoiseVariance = 15 * (Math.PI / 180); //The variance of the diffusion noise added to the orientation during resampling.
var explorationFactor = 0.05; //0.0 means no particles are randomly placed for exploration, 0.5 means 50%, 1.0 means 100%
var useExplorationParticlesGuess = false; //Whether or not to use exploration particles when estimating robot pose.

var particleDispRadius = 2; //Radius of the circle marker for each particle.
var particleDispHeadingLength = 5; //Length of the direction marker for each particle.
var errorWeightColorDivisor = 300; //Used when selecting the color to correspond with each particle.
var weightColorMultiplier = 0.9; //Used when selecting the color to correspond with each particle.

///////////////////////////////////////////
/// GLOBAL VARIABLES
///////////////////////////////////////////

var canvas; // The html object for the canvas
var ctx; // The drawing context
var frameListCont; //The html object for the div where frames and frame information is listed
var frameListTableHeader; // The html object for the header row of the frame list table
var currentFrameCont = {}; // Contains the html objects for the current frame display
var parameterElts = []; // Contains the html elements for the parameter text fields
var keyStates = {}; // Contains the status of every key on the keyboard
var frames = []; // An array of each frame, with all interesting information
var currentFrame = -1; //This keeps track of what frame the viewer is looking at (in the context of replaying past events).
var currentMaze = maze1;
var currentMazeStart = maze1Start;
var hasStarted = false; //Used for the control of the tick loop.
var running = false; //Used for the control of the tick loop.
var stop = false; //Used for the control of the tick loop.
var robotPos = [0, 0]; //The robot's x,y position.
var robotOrien = 0; //The robot's orientation (given in radians).
var lidarDistances = []; //When simulating what the LIDAR sensor would see, this contains all of the distance readings.
var particles = []; //Array of the particles used for the filter.
var predictedPose = [0, 0]; //The predicted pose of the robot, as computed by the particle filter.

///////////////////////////////////////////
/// CLASSES
///////////////////////////////////////////

//Each particle is a guess at where the robot may be, coupled with information about what that guess entails.
function Particle(pos=[0,0], orien=0) {
	this.pos = pos.slice(); //The guessed position of the robot.
	this.orien = orien; //The guessed orientation of the robot.
	this.weight = 0; //The weight of the particle reflects how well the guess matches the sensor observations.
	this.lidarReadings = new Array(lidarNumPoints).fill(0); //The LIDAR sensor readings, simulated as if the robot were precisely at this.pos.
	this.isExploration = false; //Exploration particles can be flagged, so that they aren't used when averaging particles to compute the predicted robot location.

	this.randomize = function() {
		//This simply moves the particle to a random pose in the world.
		var idx = randomIdxInMaze(); //This function gets a random location in the world that isn't in a wall, in maze coordiantes.
		var coords = mazeIdxToCoord(idx); //Convert maze coordinates to world coordinates.
		var x = coords[0] + (Math.random() * mazeBoxWidth); //Select a random spot inside the given maze square.
		var y = coords[1] + (Math.random() * mazeBoxHeight);
		this.pos = [x, y];
		this.orien = Math.random() * 2 * Math.PI - Math.PI; //I.e. uniformly distributed between -Pi and Pi.
		this.isExploration = true;
	}
}

//A frame contains all information about a given displayed frame, so that it can be retroacively displayed for playback.
function Frame(id, particles_in, robotPos_in, robotOrien_in, lidarDistances_in, predictedPose_in) {
	this.id = id; //Every frame has a unique ID.
	this.particles = particles_in.slice(); //A list of the particles in this frame.
	this.robotPos = robotPos_in.slice(); //The robot's position in this frame.
	this.robotOrien = robotOrien_in; //The robot's orientation in this frame.
	this.lidarDistances = lidarDistances_in //The measured LIDAR distances for the robot (so that they don't have to be computed again).
	this.prediction = predictedPose_in; // TODO

	//This code is a mess, and not really important.
	this.maxNormalizedIndex = 0;
	this.maxNormalizedWeight = this.particles[this.maxNormalizedIndex].weight;
	for(var i=1; i<this.particles.length; ++i) {
		if(particles[i].weight > this.maxNormalizedWeight) {
			this.maxNormalizedIndex = i;
			this.maxNormalizedWeight = this.particles[this.maxNormalizedIndex].weight;
		}
	}
	var maxError = Math.pow(Math.E, -1*dist2(this.robotPos, this.particles[this.maxNormalizedIndex].pos))
		+ Math.pow(Math.E, -1*angleDist(this.mouseOrien, this.particles[this.maxNormalizedIndex].orien));
	this.frameColorMultiplier = maxError * weightColorMultiplier;

	this.log = function() {
		//This adds a row to the HTML table that's used to log all the information.
		var row = document.createElement("tr"); //tr is the HTML code for a table row.

		function addCell(row, contents) {
			//This adds a cell to a specified row.
			var eltCont = document.createElement("td"); //td is the HTML code for a table cell. I think it's supposed to stand for "tale data"?
			var eltText = document.createTextNode(contents); //Inside the <td> element, you have to create the text itself.
			eltCont.appendChild(eltText); //Add the text to the <td> element.
			eltCont.style.padding = "2px 8px"; //Padding refers to extra space between the text and the edge of the element.
			row.appendChild(eltCont); //Add the table cell to the table row.
		}

		//Compute the error in our estimate of the robot's position.
		var error = Math.sqrt(dist2(this.robotPos, this.prediction));

		// Add a bunch of content to the html table row.
		addCell(row, "Frame " + this.id);
		addCell(row, " [ " + this.robotPos[0].toFixed(2) + ", " + this.robotPos[1].toFixed(2) + " ] ");
		addCell(row, " [ " + this.prediction[0].toFixed(2) + ", " + this.prediction[1].toFixed(2) + " ] ");
		addCell(row, error.toFixed(2));
		addCell(row, "");

		row.setAttribute("id", "frame" + this.id); //This allows us to uniquely identify the row element, so we can interact with it.
		row.lastChild.style.backgroundColor = errorColor(error);
		row.addEventListener("click", function() {
			//This handles what happens if you click on a row.
			if(running) {
				//If we're currently running the simulation, don't do anything.
				return;
			}
			//Otherwise...
			currentFrame = this.id.slice(5); //Get the frame's position in the list of frames from the HTML element's ID.
			drawFrame(frames[currentFrame], true); //Draw the frame out.
			frames[currentFrame].showCurrent()

			//Automatically scroll the page back up to the map.
			currentFrameCont.error.scrollIntoView();
			window.scrollBy(0, -25);
		});

		//Actually add the row to the top of the log.
		frameListTableHeader.parentNode.insertBefore(row, frameListTableHeader.nextSibling);
	}

	this.showCurrent = function() {
		//Display information about the current frame above the canvas.
		//elt.innerHTML is used to directly access the HTML code inside an element -- it's the easiest way to update an element.
		//But beware of changing the page this way! If you create an element, you can't immediately get it in Javascript -- you have
		//to pass control back to the browser first.
		currentFrameCont.number.innerHTML = this.id;
		currentFrameCont.actualPos.innerHTML = " [ " + this.robotPos[0].toFixed(2) + ", " + this.robotPos[1].toFixed(2) + " ] ";
		currentFrameCont.guessPos.innerHTML = " [ " + this.prediction[0].toFixed(2) + ", " + this.prediction[1].toFixed(2) + " ] ";
		var error = Math.sqrt(dist2(this.robotPos, this.prediction));
		currentFrameCont.error.innerHTML = error.toFixed(2);
		currentFrameCont.color.style.backgroundColor = errorColor(error);
	}
}

///////////////////////////////////////////
/// FUNCTIONS
///////////////////////////////////////////

function setup() {
	//The global, setup function. I run it once when the page is loaded, and then never again.

	//Grab the canvas, and set it to the appropriate size.
	canvas = document.getElementById("canvas");
	canvas.setAttribute("width", String(canvasSize[0]) + "px");
	canvas.setAttribute("height", String(canvasSize[1]) + "px");

	//I change the contents of these HTML elements at various times throughout the program.
	frameListCont = document.getElementById("frameListCont");
	frameListTableHeader = document.getElementById("frameListTableHeader");
	currentFrameCont.number = document.getElementById("currentFrameNumber");
	currentFrameCont.actualPos = document.getElementById("currentFrameActual");
	currentFrameCont.guessPos = document.getElementById("currentFrameGuess");
	currentFrameCont.error = document.getElementById("currentFrameError");
	currentFrameCont.color = document.getElementById("currentFrameColor");

	//elt.addEventListener pairs a function to an event. So when you click these elements, the corresponding function is called.
	document.getElementById("startButton").addEventListener("click", startButtonClick);
	document.getElementById("pauseButton").addEventListener("click", pauseButtonClick);
	document.getElementById("resetButton").addEventListener("click", resetButtonClick);

	document.getElementById("randomMazeButton").addEventListener("click", randomMazeClick);
	document.getElementById("maze1Button").addEventListener("click", maze1Click);
	document.getElementById("maze2Button").addEventListener("click", maze2Click);
	document.getElementById("maze3Button").addEventListener("click", maze3Click);

	//In this case, instead of a function name, I pass in an "anonymous function", defined right there.
	//This is just because they're very short functions -- all they do is update the internal state based on that of the checkbox.
	document.getElementById("checkboxLIDAR").addEventListener("change", function() { vizDrawLidar = this.checked; });
	document.getElementById("checkboxParticles").addEventListener("change", function() { vizDrawParticles = this.checked; });
	document.getElementById("checkboxParticleLIDAR").addEventListener("change", function() { vizParticleLIDAR = this.checked; });

	//This gathers all of the <textarea> elements used to specify experimental parameters.
	//Class name is not unique, so document.getElementsByClassName returns a list-like object.
	var parElts = document.getElementsByClassName("parameterForm");
	//Convert the list-like object to an actual list.
	for(var i=0; i<parElts.length; ++i) {
		parameterElts.push(parElts[i]);
	}

	//You can also add event listeners to the whole document itself.
	//When a key is pressed, I need more information, so I pass the event object itself to the callback function.
	//Anonymous functions have to be used in this context (I think).
	document.addEventListener("keydown", function(e) {
		//e is the event object, in this case. Name doesn't matter.
		keydownHandler(e);
	});
	document.addEventListener("keyup", function(e) {
		var keyId = e.which; //This determines which key was pressed (every key has a numerical ID).
		keyStates[keyId] = false; //I'm actually keeping track of every key's status (pressed or released).
	})

	ctx = canvas.getContext("2d"); //Get the drawing context from the canvas objec.

	//These next two lines transform the canvas to a more familiar coordinate system.
	ctx.transform(1, 0, 0, -1, 0, 0); // Flip the context so y+ is up
	ctx.transform(1, 0, 0, 1, 0, -canvasSize[1]); //Move 0,0 to the bottom left of the screen

	//Reset handles getting everything set up for the non-boilerplate code to run.
	reset();
}
function keydownHandler(e) {
	//This function gets pretty complex, since there are a lot of things that need to be done depending on which key was pressed.
	e = e || window.event; //I don't actually remember why this is needed.
	var target = e.target || e.srcElement; //This gets the element that was selected when the keypress occurred.
	//We don't want to do stuff if they were typing or something -- this regex handles that.
	if ( !/INPUT|TEXTAREA|SELECT|BUTTON/.test(target.nodeName) ) {
		// Ignore 
		var keyId = e.which;
		keyStates[keyId] = true; //Keep track of which keys are actively being pressed.
		console.log("Key down: " + keyId);
		switch(keyId) {
			case 39: //Right arrow key
				if(!running) {
					//If we're in playback mode, the left and right arrow keys can be used to display the previous and next frame, respectively.
					if(currentFrame < frames.length-1) {
						//But don't go past the end!
						++currentFrame;
					}
				}
				drawFrame(frames[currentFrame]);
				break;
			case 37: //Left arrow key
				if(!running) {
					//If we're in playback mode, the left and right arrow keys can be used to display the previous and next frame, respectively.
					if(currentFrame > 0) {
						//But don't go past 0!
						--currentFrame;
					}
				}
				drawFrame(frames[currentFrame]);
				break;
			case 48: //0 key
				if(!running) {
					//If we're in playback mode, the 0 key jumps back to the starting frame.
					currentFrame = 0;
					drawFrame(frames[currentFrame]);
				}
				break;
			case 57: //9 key
				if(!running) {
					//If we're in playback mode, the 9 key jumps back to the final frame.
					currentFrame = frames.length-1;
					drawFrame(frames[currentFrame]);
				}
				break;
			case 32: //spacebar
				e.preventDefault(); //This stops the spacebar from scrolling the page.
				//If we're running, pause. If not, i.e. we're paused or haven't started, then start.
				if(running) {
					pauseButtonClick();
				}
				else {
					startButtonClick();
				}
		}
	}
}
function resetContext() {
	//If the user changes attributes of the canvas, we need to acually create the context again.
	canvas.setAttribute("width", String(canvasSize[0]) + "px");
	canvas.setAttribute("height", String(canvasSize[1]) + "px");

	ctx = canvas.getContext("2d");
	ctx.transform(1, 0, 0, -1, 0, 0); // Flip the context so y+ is up
	ctx.transform(1, 0, 0, 1, 0, -canvasSize[1]); //Move 0,0 to the bottom left of the screen

	reset();
}
function readonly(doMakeReadonly) {
	//This function is used to toggle whether or not you can modify the various parameter settings.
	//doMakeReadonly determines which setting to use (true or false).
	for(var i=0; i<parameterElts.length; ++i) {
		if(doMakeReadonly) {
			parameterElts[i].readOnly = "true"; //This makes it so you can't modify it.
			parameterElts[i].style.color = "grey"; //This just looks better.
		}
		else {
			parameterElts[i].removeAttribute("readonly"); //To make something not readonly, you have to actually remove the attribute.
			parameterElts[i].style.color = "black"; //Return to default styling.
		}
	}
}

function startButtonClick() {
	//This is the callback function if you click the start button.
	if(!running && !hasStarted) {
		//If we aren't already running, and we haven't started yet, start for the first time.
		readonly(true); //Prevent the user from changing the parameters while it's running.
		reset();
		generateParticles(); //When you first start a particle filter, you have to create the initial particle set.
		running = true;
		hasStarted = true;
		tick(); //This is the actual loop function. You only need to call it once -- it will keep calling itself as appropriate.
	}
	else if(!running && hasStarted) {
		//If we aren't running, but we have started yet, resume where we left off.
		running = true;
		tick(); //This is the actual loop function. You only need to call it once -- it will keep calling itself as appropriate.
	}
	//If we are running, do nothing.
}
function pauseButtonClick() {
	//This is the callback function if you click the pause button.
	if(running) {
		//If you click the pause button while we're running, stop. Otherwise, do nothing.
		stop = true;
	}
	//Note that the actual process of stopping is handled within the tick() function.
	//This just lets the function know to stop the next time around.
}
function resetButtonClick() {
	//This is the callback function if you click the reset button.
	if(!running) {
		readonly(false); //Allow the user to change the parameters again.
		hasStarted = false;
		reset(); //Get everything back to its initial state.
	}
}
function randomMazeClick() {
	//This is the callback function if you click the random maze button.
	if(!running) {
		//If we aren't currently running, generate a new maze, and reset.
		//resetContext() isn't needed, because the canvas itself isn't changing.
		generateRandomMaze();
		document.getElementById("mazeHeight").value = currentMaze.length;
		document.getElementById("mazeWidth").value = currentMaze[0].length;
		reset();
	}
}
function maze1Click() {
	//This is the callback function if you click the maze 1 button.
	if(!running) {
		//If we aren't currently running, load maze 1.
		currentMaze = maze1;
		currentMazeStart = maze1Start;
		canvasHeightBoxes = currentMaze.length;
		canvasWidthBoxes = currentMaze[0].length;
		canvasSize = [canvasWidthBoxes*mazeBoxWidth, canvasHeightBoxes*mazeBoxHeight];
		resetContext(); //This could potentially change the canvas if the user had previously modified the parameters,
		                //so we have to resetContext().
		document.getElementById("mazeHeight").value = currentMaze.length;
		document.getElementById("mazeWidth").value = currentMaze[0].length;
		reset();
	}
}
function maze2Click() {
	//This is the callback function if you click the maze 2 button.
	if(!running) {
		//If we aren't currently running, load maze 2.
		currentMaze = maze2;
		currentMazeStart = maze2Start;
		canvasHeightBoxes = currentMaze.length;
		canvasWidthBoxes = currentMaze[0].length;
		canvasSize = [canvasWidthBoxes*mazeBoxWidth, canvasHeightBoxes*mazeBoxHeight];
		resetContext(); //This could potentially change the canvas if the user had previously modified the parameters,
		                //so we have to resetContext().
		document.getElementById("mazeHeight").value = currentMaze.length;
		document.getElementById("mazeWidth").value = currentMaze[0].length;
		reset();
	}
}
function maze3Click() {
	//This is the callback function if you click the maze 3 button.
	if(!running) {
		//If we aren't currently running, load maze 3.
		currentMaze = maze3;
		currentMazeStart = maze3Start;
		canvasHeightBoxes = currentMaze.length;
		canvasWidthBoxes = currentMaze[0].length;
		canvasSize = [canvasWidthBoxes*mazeBoxWidth, canvasHeightBoxes*mazeBoxHeight];
		resetContext(); //This could potentially change the canvas if the user had previously modified the parameters,
		                //so we have to resetContext().
		document.getElementById("mazeHeight").value = currentMaze.length;
		document.getElementById("mazeWidth").value = currentMaze[0].length;
		reset();
	}
}

function tick() {
	//This is the function where it all happens. It will repeatedly call itself until stopped.
	//It handles animation and the particle filter.
	if(stop) {
		//Stop is set to true if the user pauses.
		running = false;
		stop = false;
		return; //We return early, so all the code isn't executed.
	}

	var update = updateRobotPos(); //Based on what key the users are pressing, move the robot.
	var posChange = [update[0], update[1]]; //Record the change in position.
	var orienChange = update[2]; //Record the change in orientation.
	//Get the LIDAR distances. (Several functions are needed to modify the data.)
	lidarDistances = fixLidarNegatives(noisifyLidar(computeLidarDistances(robotPos, robotOrien)));

	measureParticles(); //This computes the simulated LIDAR observation for every particle.
	calculateWeights(); //This computes the weights for each particle, based on that observation.
	makePrediction(); //This predicts the location of the robot, based on the particles and their weights.

	saveFrame(); //Save the curent frame, so it can be viewed later.
	frames[frames.length-1].log(); //This adds the frame's information to the log below the canvas.

	resample(); //This is the function where new particles are created based on the old particles.
	translateParticles(posChange, orienChange); //State update, based on the robot's motion.

	drawFrame(frames[frames.length-1]); //Update the display with the most recent (i.e. current) frame.
	currentFrame = frames.length-1; //Update the id of the current frame (needed for arrow keys to properly function during playback).

	window.setTimeout(tick, tickTime); //Call this function again, after tickTime ms.
}
function reset() {
	//This function resets everything to the inital state.

	//Reset the robot.
	robotPos = mazeIdxToCoord(currentMazeStart);
	robotPos[0] += 0.5 * mazeBoxWidth;
	robotPos[1] += 0.5 * mazeBoxHeight;
	robotOrien = 0;
	lidarDistances = new Array(lidarNumPoints).fill(0); //Clear the LIDAR measurements.
	particles = []; //Clear the particles.
	while(frameListTableHeader.nextSibling) {
		//Delete all children of frameListCont, except the header row (frameListTableHeader).
		frameListTableHeader.parentNode.removeChild(frameListTableHeader.nextSibling);
	}
	//Draw the robot and maze.
	clearCanvas();
	drawMaze(currentMaze);
	drawRobot(robotPos, robotOrien);
	document.getElementById("mazeStarti").value = currentMazeStart[0];
	document.getElementById("mazeStartj").value = currentMazeStart[1];
	frames = [];
	hasStarted = false;
}
function saveFrame() {
	//Create a new Frame object with the current values, and add it to the list of frames.
	var frame = new Frame(frames.length, particles, robotPos, robotOrien, lidarDistances, predictedPose);
	frames.push(frame);
}

function generateParticles() {
	//This function just creates all the particles in the list, and randomizes their locations.
	for(var i=0; i<numParticles; ++i) {
		particles[i] = new Particle();
		particles[i].randomize();
	}
}
function measureParticles() {
	//This function computes the LIDAR readings for every particle.
	//It also moves particles that would be off the world or in a wall to a random location.
	for(var i=0; i<numParticles; ++i) {
		//For each particle...
		if(!particleIsValid(particles[i])) {
			//If it's off the world or in a wall, randomize it.
			particles[i].randomize();
		}
		//Compute the LIDAR readings for the particle. We use the same function as that for computing the robot's LIDAR readings.
		particles[i].lidarReadings = computeLidarDistances(particles[i].pos, particles[i].orien);
	}
}
function calculateWeights() {
	//This function computes the weights for every particle.
	var lidarDataArr = []; //This array will contain the difference between the observed LIDAR reading and the particle's simulated reading.
	var lidarDataWeights = []; //This array will contain the weights.
	for(var i=0; i<lidarNumPoints; ++i) {
		lidarDataArr[i] = particles.map(a => Math.abs(a.lidarReadings[i] - lidarDistances[i])); //Get the differences in distance.
		lidarDataWeights[i] = normalizeWeight(weightFromDistance(lidarDataArr[i])); //Convert those differences into a weight.
	}
	//Combine and normalize the weights.
	var combinedWeights = [];
	for(var i=0; i<numParticles; ++i) {
		combinedWeights[i] = 1;
		for(var j=0; j<lidarNumPoints; ++j) {
			combinedWeights[i] *= lidarDataWeights[j][i];
		}
	}

	combinedWeights = normalizeWeight(combinedWeights); //Normalize again.
	for(var i=0; i<particles.length; ++i) {
		particles[i].weight = combinedWeights[i]; //Update the particle weights.
	}
}
function resample() {
	//Resampling step. This implements importance sampling.
	//It's implemented slightly strangely, because Javascript doesn't have a great math library.
	var weightData = particles.map(a => a.weight);
	var newParticles = [];
	var cs = cumsum(weightData);
	var step = 1/((numParticles * (1 - explorationFactor))+1);
	var chkVal = step;
	var chkIndex = 0;
	for(var i=0; i<numParticles * (1 - explorationFactor); ++i) {
		while(cs[chkIndex] < chkVal) {
			++chkIndex;
		}
		chkVal += step;
		var newPos = particles[chkIndex].pos;
		var newOrien = particles[chkIndex].orien;
		var randomDist = randomNormal(0, particlePosNoiseVariance);
		var randomAngle = Math.random() * Math.PI;
		newPos[0] += randomDist * Math.cos(randomAngle);
		newPos[1] += randomDist * Math.sin(randomAngle);
		newOrien += randomNormal(0, particleOrientationNoiseVariance);
		newParticles[i] = new Particle(newPos, newOrien);
	}
	for(var i=newParticles.length; i<numParticles; ++i) {
		//Whatever particles haven't been resampled, are just randomly scattered to explore.
		newParticles[i] = new Particle();
		newParticles[i].randomize();
	}
	particles = newParticles.slice();
}
function translateParticles(posChange, orienChange) {
	//This updates all of the particles based on the robot's change in position.
	for(var i=0; i<numParticles; ++i) {
		particles[i].pos[0] += posChange[0];
		particles[i].pos[1] += posChange[1];
		particles[i].orien += orienChange;
	}
}
function particleIsValid(p) {
	//Check that it's in the canvas bounds.
	if(p.pos[0] < 0 || p.pos[0] >= canvasSize[0] || p.pos[1] < 0 || p.pos[1] >=canvasSize[1]) {
		return false;
	}
	var idx = coordToMazeIdx(p.pos); //Get the cell the particle is in.
	var i = idx[0];
	var j = idx[1];
	if(currentMaze[i][j] == true) {
		//Check if the particle is in a wall. Note that 1 is true and 0 is false.
		return false;
	}
	return true;
}
function makePrediction() {
	//Given all of the weighted particles, predict the robot's location via a weighted average.
	//One could also use the MLE or MAP particles.
	var total = [0, 0];
	var numUsed = 0;
	for(var i=0; i<particles.length; ++i) {
		if(!particles[i].isExploration || useExplorationParticlesGuess) {
			//Check if a particle is exploration before using it in our estimate.
			total[0] += particles[i].pos[0];
			total[1] += particles[i].pos[1];
			++numUsed;
		}
	}
	if(numUsed == 0) {
		numUsed = 1;
	}
	total[0] /= numUsed;
	total[1] /= numUsed;
	predictedPose = total.slice(); //Copy the array.
}
function sortParticles(particles) {
	//This sorts the particles by weight. I got this code from Stack Overflow.
	sorted = particles.slice()
	sorted.sort((a, b) => (a.weight > b.weight) ? 1 : -1);
	return sorted;
}

function updateRobotPos() {
	//This function is run every tick loop, based on the keys that are being held down at that time.
	var upKey = 87; //W
	var leftKey = 65; //A
	var downKey = 83; //S
	var rightKey = 68; //D

	var orienChange = 0;
	var posChange = [0, 0];

	//Key are undefined before they're first pressed, but applying the ! operator twice converts undefined to false.
	//I.e., !undefined == true, !!undefined == false

	//First, handle orientation change.
	if((!!keyStates[leftKey]) && !keyStates[rightKey]) {
		//If we're trying to turn left and not right...
		orienChange = (tickTime / 1000) * robotTurnRate;
		robotOrien += orienChange;
	}
	else if(!keyStates[leftKey] && (!!keyStates[rightKey])) {
		//If we're trying to turn right and not left...
		orienChange = -(tickTime / 1000) * robotTurnRate;
		robotOrien += orienChange;
	}

	//Now, handle position change.
	if((!!keyStates[upKey]) && !keyStates[downKey]) {
		//If we're trying to go forward and not backward...
		var dx = (tickTime / 1000) * robotSpeed * Math.cos(robotOrien);
		var dy = (tickTime / 1000) * robotSpeed * Math.sin(robotOrien);
		var newPos = [
			robotPos[0] + dx,
			robotPos[1] + dy
		];
		if(!isColliding(newPos)) {
			//If we're not driving into a wall or off the map, update the position.
			robotPos[0] += dx;
			robotPos[1] += dy;
		}
		posChange = [dx, dy];
	}
	else if(!keyStates[upKey] && (!!keyStates[downKey])) {
		//If we're trying to go backward and not forward...
		var dx = (tickTime / 1000) * robotSpeed * Math.cos(robotOrien);
		var dy = (tickTime / 1000) * robotSpeed * Math.sin(robotOrien);
		var newPos = [
			robotPos[0] - dx,
			robotPos[1] - dy
		];
		if(!isColliding(newPos)) {
			//If we're not driving into a wall or off the map, update the position.
			robotPos[0] -= dx;
			robotPos[1] -= dy;
		}
		posChange = [dx, dy];
	}
	return [posChange[0], posChange[1], orienChange];
}
function isColliding(pos) {
	//Check if a set of given world coordinates are colliding with a wall or off the map.
	if(pos[0] < 0 || pos[0] >= canvasSize[0] || pos[1] < 0 || pos[1] >= canvasSize[1]) {
		//Check if we're off the map.
		return true;
	}
	var currentMazeIdx = coordToMazeIdx(pos); //Get the maze index coordinates.
	var i = currentMazeIdx[0];
	var j = currentMazeIdx[1];
	return currentMaze[i][j] == true;
}
function computeLidarDistances(pos, orien) {
	//This handles the raycasting to determine how far a given LIDAR beam should read.
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
	//This adds normally-distributed noise to a list of LIDAR readings.
	distances_out = distances_in.slice();
	for(var i=0; i<lidarNumPoints; ++i) {
		distances_out[i] += randomNormal(0, lidarNoiseVariance); //(0 is the mean.)
	}
	return distances_out
}
function fixLidarNegatives(distances_in) {
	//If we're colliding with a wall, the added noise from the LIDAR may make the distance negative.
	//We replace such values with a distance of 0.
	distances_out = distances_in.slice();
	for(var i=0; i<lidarNumPoints; ++i) {
		if(distances_in[i] < 0) {
			distances_out[i] = 0;
		}
	}
	return distances_out;
}
function isZero(val) {
	//Floating point computations are imprecise.
	return Math.abs(val) < 0.0000001
}

function drawFrame(frame) {
	//This function handles all of the drawing actions for a single "frame".
	clearCanvas(); //Clear the whole canvas.
	drawMaze(currentMaze); //Draw the maze.
	drawRobot(frame.robotPos, frame.robotOrien); //Draw the robot.
	if(vizDrawLidar) {
		//Draw the robot's LIDAR.
		drawLidar(frame.robotPos, frame.robotOrien, frame.lidarDistances);
	}
	if(vizDrawParticles) {
		//Draw the particles. We sort so that the highest-weight particles are drawn last, and hence appear more prominently.
		sortedParticles = sortParticles(frame.particles);
		for(var i=0; i<frame.particles.length; ++i) {
			drawParticle(sortedParticles[i], frame.maxNormalizedWeight);
		}
	}
	if(vizParticleLIDAR) {
		//Draw the LIDAR for the particles.
		for(var i=0; i<frame.particles.length; ++i) {
			drawLidar(frame.particles[i].pos, frame.particles[i].orien, frame.particles[i].lidarReadings);
		}
	}
}
function clearCanvas() {
	//This does exactly what you think.
	ctx.clearRect(0, 0, canvasSize[0], canvasSize[1]);
}
function drawBox(gridPos, filled) {
	//This draws a grid box from the maze, and shades it in if it's a wall.
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
	//orien should be in radians
	ctx.strokeStyle = robotColor;

	//Draw the outer circle
	ctx.beginPath();
	//We initially move to a position on the circle itself, so that there's no weird line from the center to the circle.
	//Just JavaScript things! :)
	ctx.moveTo(pos[0] + robotSize, pos[1]);
	ctx.arc(pos[0], pos[1], robotSize, 0, 2*Math.PI, true);
	ctx.stroke();

	//Draw a triangle showing orientation.
	//First, compute the coordinates of the three points.
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
	
	//Now actually draw the triangle.
	ctx.beginPath();
	ctx.moveTo(front[0], front[1]);
	ctx.lineTo(backLeft[0], backLeft[1]);
	ctx.lineTo(backRight[0], backRight[1]);
	ctx.lineTo(front[0], front[1]);
	ctx.stroke();
}
function drawMaze(maze) {
	//Draw all of the boxes in the maze.
	for(var i=0; i<maze.length; ++i) {
		for(var j=0; j<maze[i].length; ++j) {
			//The maze array is row-major, but the first coordinate is usually taken to be horizontal (i.e. column).
			var x = j;
			var y = (maze.length-1) - i;
			drawBox([x, y], maze[i][j]);
		}
	}
}
function drawLidar(pos, orien, distances) {
	//Draw out the LIDAR beams.
	//Note: distances.length == lidarNumPoints
	for(var i=0; i<lidarNumPoints; ++i) {
		var frameAngle = (-lidarFOV / 2) + (i * lidarAngle);
		var globalFrameAngle = frameAngle + orien;
		var dx = distances[i] * Math.cos(globalFrameAngle);
		var dy = distances[i] * Math.sin(globalFrameAngle);

		ctx.strokeStyle = lidarBeamColor;
		ctx.beginPath();
		ctx.moveTo(pos[0], pos[1]);
		ctx.lineTo(pos[0] + dx, pos[1] + dy);
		ctx.stroke();
	}
}
function drawParticle(p, maxWeight, mult) {
	//Draw a single particle p. We need to know maxWeight for weightToColor.
	color = weightToColor(p.weight / maxWeight);
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
	//This just randomly assigns each square in the maze to be a wall or not.
	var maze = []
	for(var i=0; i<canvasHeightBoxes; ++i) {
		maze[i] = []
		for(var j=0; j<canvasWidthBoxes; ++j) {
			maze[i][j] = (Math.random() < randomMazeDensity);
		}
	}
	currentMaze = maze;
	var mazeStart = randomIdxInMaze(); //This function makes sure the robot doesn't start in a wall.
	currentMazeStart = mazeStart;
}
function mazeIdxToCoord(idx) {
	//Convert a set of (i,j) indexes in the maze array, to (x,y) world coordinates.
	//Note that the maze array is row-major, but the first coordinate is usually taken to be horizontal (i.e. column).
	var i = idx[0];
	var j = idx[1];
	var x = j * mazeBoxWidth;
	var y = ((canvasHeightBoxes-1) - i) * mazeBoxHeight;
	return [x, y];
}
function coordToMazeIdx(coord) {
	//Convert a set of (x,y) world coordinates, to (i,j) indexes in the maze array.
	//Note that the maze array is row-major, but the first coordinate is usually taken to be horizontal (i.e. column).
	var x = coord[0];
	var y = coord[1];
	var i = (canvasHeightBoxes-1) - Math.floor(y / mazeBoxHeight);
	var j = Math.floor(x / mazeBoxWidth);
	return [i, j]
}
function randomIdxInMaze() {
	//Select a random maze grid square that's not a wall.
	var idx = [0, 0];
	do {
		idx[0] = Math.floor(Math.random() * canvasHeightBoxes)
		idx[1] = Math.floor(Math.random() * canvasWidthBoxes)
	}
	while(currentMaze[idx[0]][idx[1]] == true);
	return idx;
}

function randomNormal(mu, sigma) {
	//Computed using the Box-Muller transform.
	//https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
	var u1 = Math.random();
	var u2 = Math.random();
	var z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
	return mu + (z0 * sigma);
}
function weightToColor(weight) {
	//This is kinda gross. Just ignore it.
	//In the future, go steal a colormap function.
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
	//Restrict the error weight to [0,1], and get its corresponding color.
	var errorWeight = error / errorWeightColorDivisor;
	if(errorWeight < 0) { errorWeight = 0; }
	if(errorWeight > 1) { errorWeight = 1; }
	errorWeight = 1 - errorWeight;
	return weightToColor(errorWeight);
}
function dist2(a, b) {
	//Euclidean distance-squared.
	//Often used instead of regular Euclidean distance, since computing a square root is expensive and usually unnecessary.
	var dx = b[0]-a[0];
	var dy = b[1]-a[1];
	return (dx*dx) + (dy*dy);
}
function angleDist(a, b) {
	//Compute the "distance" between two angles.
	var diff = a - b;
	function specialMod(lhs, rhs) {
		return lhs - (Math.floor(lhs/rhs) * rhs);
	}
	return (specialMod(diff + Math.PI, Math.PI*2)) - Math.PI;
}
function mean(arr) {
	//Compute the mean of a given array.
	var total = 0;
	for(var i=0; i<arr.length; ++i) {
		total += arr[i];
	}
	return total / arr.length;
}
function variance(arr) {
	//Compute the variance of a given array.
	var v = 0;
	var m = mean(arr);
	for(var i=0; i<arr.length; ++i) {
		v += arr[i]*arr[i];
	}
	v /= arr.length;
	v -= m*m;
	return v;
}
function normalizeWeight(arr) {
	//Normalize an array so its elements sum to 1.
	var total = 0;
	for(var i=0; i<arr.length; ++i) {
		total += arr[i];
	}
	for(var i=0; i<arr.length; ++i) {
		arr[i] /= total;
	}
	return arr;
}
function cumsum(arr) {
	//Take the cumulative sum of an array.
	for(var i=1; i<arr.length; ++i) {
		arr[i] += arr[i-1];
	}
	return arr;
}
function weightFromDistance(distances) {
	//Given an array of particle LIDAR distance differences, convert it to a list of weights.
	var v = variance(distances);
	var m = 1/(Math.sqrt(2*Math.PI*v));
	var weights = [];
	for(var i=0; i<distances.length; ++i) {
		weights[i] = Math.pow(Math.E, -(Math.pow((distances[i]), 2) / (2*v))) * m;
	}
	return weights;
}

function prettyPrintMazeArr(maze) {
	//Print the maze out to the console in a fancy way.
	console.log("[");
	for(var i=0; i<maze.length; ++i) {
		lineStr = "\t[";
		var j=0;
		for(; j<maze[i].length-1; ++j) {
			lineStr += String(Number(maze[i][j]));
			lineStr += ", ";
		}
		lineStr += String(Number(maze[i][j]));
		lineStr += "],";
		console.log(lineStr);
	}
	console.log("]");
}

///////////////////////////////////////////
/// EXECUTED CODE
///////////////////////////////////////////

//Actually call the setup function after defining everything.
//This is called when the page loads.
setup();