/* 
* Filename: Project
* Project: Project SENG3040
* Author: Bakr Jasim
* Date: December 12, 2023
* Description: This is the final project for GAS course, this will be creating a video feed in middile 
* of the canvas, the video stream will allow the user to draw shapes and stams, and have a screenshot
* of the video feed as well. 
*/

let video; // Variable to hold the video capture
let filterType = 'NORMAL'; // Variable to hold the current filter type
let filterSelect; // Variable to hold the filter selection dropdown
let stamps = []; // Array to hold the stamp images
let stampSelect; // Variable to hold the stamp selection dropdown
let currentStamp; // Variable to hold the currently selected stamp
let items = []; // Array to hold the items (stamps and shapes) to be drawn on the canvas
let shapes = []; // Array to hold the shapes to be drawn on the canvas
let stampPreview; // Variable to hold the preview of the currently selected stamp
let toolSelect; // Variable to hold the tool selection dropdown
let currentTool; // Variable to hold the currently selected tool
let currentShape; // Variable to hold the currently drawn shape
let colorSelect; // Variable to hold the color selection for the shape border
let thicknessSelect; // Variable to hold the thickness selection for the shape border
let buffer; // Variable to hold the graphics buffer for the video feed

/*
* Function: preload
* Description: This function will load the stamp images before the setup function is called
* Parameter: no parameter
* Return: No return
*/
function preload() {
  // Load the stamp images and hide them initially
  stamps[0] = createImg("assets/original.png").hide();
  stamps[1] = createImg("assets/approved.png").hide();
  stamps[2] = createImg("assets/stamp.png").hide();
  stamps[3] = createImg("assets/best-seller.png").hide();
}

/*
* Function: setup
* Description: This function will setup the initial state of the application
* Parameter: no parameter
* Return: No return
*/
function setup() {
  // Create the canvas and the video capture
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide(); // Hide the HTML element to draw it on the canvas instead

  // Create the graphics buffer
  buffer = createGraphics(640, 480);

  // Calculate the positions for the UI elements
  let uiSelection = (windowWidth + 640) / 2 + 190; // we can adjust this value as needed
  let uiDescription = (windowWidth + 640) / 2 + 20; // we can adjust this value as needed

  // Create the filter selection dropdown
  filterSelect = createSelect();  
  filterSelect.option('No Filter');
  filterSelect.option('INVERT');
  filterSelect.option('POSTERIZE');
  filterSelect.option('GRAY');
  filterSelect.option('BLUR');
  filterSelect.changed(changeFilter);
  createP('Filter:').position(uiDescription,  115);
  filterSelect.position(uiSelection, 130);

  // Create the stamp selection dropdown
  stampSelect = createSelect();
  stampSelect.option('No Stamp');
  stampSelect.option('Stamp 1');
  stampSelect.option('Stamp 2');
  stampSelect.option('Stamp 3');
  stampSelect.option('Stamp 4');
  stampSelect.changed(changeStamp);
  createP('Stamp:').position(uiDescription,  145);
  stampSelect.position(uiSelection, 160);

  // Create the tool selection dropdown
  toolSelect = createSelect();
  toolSelect.option('No Tool');
  toolSelect.option('Rectangle');
  toolSelect.option('Ellipse');
  toolSelect.changed(changeTool);
  createP('Select Shape Tool:').position(uiDescription,  175);
  toolSelect.position(uiSelection, 190);

  // Create the thickness selection dropdown
  thicknessSelect = createSelect();
  thicknessSelect.option('NONE');
  thicknessSelect.option('5');
  thicknessSelect.option('10');
  thicknessSelect.option('15');
  createP('Border Thikness:').position(uiDescription,  205);
  thicknessSelect.position(uiSelection, 220);

  // Create the border color picker
  createP('Border Color:').position(uiDescription,  240);
  colorSelect = createColorPicker('#000000'); // for border color
  colorSelect.input(() => console.log('Border color changed:', colorSelect.color()));
  colorSelect.position(uiSelection, 250);

  // Create the fill color picker
  createP('Shape Color:').position(uiDescription,  275);
  fillColorSelect = createColorPicker('#ffffff'); // for fill color
  fillColorSelect.input(() => console.log('Fill color changed:', fillColorSelect.color()));
  fillColorSelect.position(uiSelection, 285);

  // Create the reset button
  let resetButton = createButton('Reset');
  createP('Reset Stamps & Shapes:').position(uiDescription,  310);
  resetButton.mousePressed(resetSketch);
  resetButton.position(uiSelection, 325);
}

/*
* Function: draw
* Description: This function will draw the entire canvas and the video feed with the UI
* Parameter: no parameter
* Return: No return
*/
function draw() {
  // Set the background color
  background(220);

  // Draw the video feed in the center of the canvas
  image(video, (windowWidth - 640) / 2, (windowHeight - 480) / 2);

  // Draw the video feed onto the buffer
  buffer.image(video, 0, 0);

  // Apply the selected filter to the buffer
  if (filterType === 'INVERT') {
    buffer.filter(INVERT);
  } else if (filterType === 'POSTERIZE') {
    buffer.filter(POSTERIZE, 3);
  } else if (filterType === 'GRAY') {
    buffer.filter(GRAY);
  } else if (filterType === 'BLUR') {
    buffer.filter(BLUR, 5);
  }  

  // Draw the buffer onto the canvas
  image(buffer, (windowWidth - 640) / 2, (windowHeight - 480) / 2);

  // Draw the stamps and shapes
  for (let item of items) {
    if (item.type === 'stamp') {
      image(item.image, item.x - item.image.width / 2, item.y - item.image.height / 2);
    } else if (item.type === 'Rectangle' || item.type === 'Ellipse') {
      drawShape(item);
    }
  }

  // Draw the current stamp or shape
  if (currentStamp && mouseX >= (windowWidth - 640) / 2 && mouseX <= (windowWidth + 640) / 2 && mouseY >= (windowHeight - 480) / 2 && mouseY <= (windowHeight + 480) / 2) {
    image(currentStamp, mouseX - currentStamp.width / 2, mouseY - currentStamp.height / 2);
  } else if (currentShape) {
    drawShape(currentShape);
  }

  // Draw the current shape again if it exists
  if (currentShape) {
    drawShape(currentShape);
  }
}

/*
* Function: resetSketch
* Description: This function will reset the sketch to its initial state
* Parameter: no parameter
* Return: No return
*/
function resetSketch() {
  items = []; // Clear all stamps and shapes
  filterType = 'NORMAL'; // Reset the active filter
  filterSelect.selected('No Filter'); // Reset the filter dropdown menu
  currentStamp = null; // Clear the current stamp
  stampSelect.selected('No Stamp'); // Reset the stamp dropdown menu
  stampSelect.enable(); // Enable the stamp selection
  currentTool = null; // Clear the current tool
  toolSelect.selected('No Tool'); // Reset the tool dropdown menu
  currentShape = null; // Clear the current shape
  thicknessSelect.selected('NONE'); // Reset the thickness dropdown menu
  colorSelect.value('#000000'); // Reset the border color picker
  fillColorSelect.value('#ffffff'); // Reset the fill color picker
  if (stampPreview) {
    stampPreview.remove(); // Remove the stamp preview
    stampPreview = null;
  }
}

/*
* Function: changeFilter
* Description: This function will update the filter type based on the selected option in the filter dropdown menu
* Parameter: no parameter
* Return: No return
*/
function changeFilter() {
  // Update the filter type based on the selected option in the filter dropdown menu
  filterType = filterSelect.value();
}


/*
* Function: changeStamp
* Description: This function will update the current stamp and the stamp preview based on the selected option in the stamp dropdown menu
* Parameter: no parameter
* Return: No return
*/
function changeStamp() {
  // Determine the index of the selected stamp
  let stampIndex = stampSelect.value() === 'No Stamp' ? -1 : parseInt(stampSelect.value().split(' ')[1]) - 1;

  // If a stamp is currently selected, hide it
  if (currentStamp) {
    currentStamp.hide(); // Hide the previous stamp
  }

  // Update the current stamp based on the selected option in the stamp dropdown menu
  currentStamp = stampIndex === -1 ? null : stamps[stampIndex];

  // If a stamp is selected, show it and update the stamp preview
  if (currentStamp) {
    currentStamp.show(); // Show the selected stamp
    stampPreview = currentStamp;
    stampPreview.size(150, 150); // Set the size of the stamp preview
    stampPreview.position(20, 20); // Position the stamp preview
  } else {
    // If no stamp is selected, remove the stamp preview
    stampPreview.remove(); // Remove the stamp preview
    stampPreview = null;
  }
}

/*
* Function: mousePressed
* Description: This function will handle the mouse pressed event
* Parameter: no parameter
* Return: No return
*/
function mousePressed() {
  // If a stamp is currently selected and the mouse is within the video UI, stamp the current stamp at the mouse position
  if (currentStamp && mouseX - currentStamp.width / 2 >= (windowWidth - 640) / 2 && mouseX + currentStamp.width / 2 <= (windowWidth + 640) / 2 && mouseY - currentStamp.height / 2 >= (windowHeight - 480) / 2 && mouseY + currentStamp.height / 2 <= (windowHeight + 480) / 2) {
    items.push({
      type: 'stamp',
      image: currentStamp,
      x: mouseX,
      y: mouseY
    });
  } 
  // If a shape tool is currently selected and the mouse is within the video UI, start drawing a shape at the mouse position
  else if (currentTool && mouseX >= (windowWidth - 640) / 2 && mouseX <= (windowWidth + 640) / 2 && mouseY >= (windowHeight - 480) / 2 && mouseY <= (windowHeight + 480) / 2) {
    currentShape = {  
      type: currentTool,
      x1: mouseX,
      y1: mouseY,
      x2: mouseX,
      y2: mouseY,
      color: colorSelect.color(),
      fillColor: fillColorSelect.value(),
      thickness: thicknessSelect.value() === 'NONE' ? 0 : parseInt(thicknessSelect.value()),
    };
    items.push(currentShape);
  }
}

/*
* Function: mouseDragged
* Description: This function will handle the mouse dragged event
* Parameter: no parameter
* Return: No return
*/
function mouseDragged() {
  // If a shape is currently being drawn and the mouse button is held down, update the second corner of the shape
  if (currentShape && mouseIsPressed) {
    currentShape.x2 = constrain(mouseX, (windowWidth - 640) / 2, (windowWidth + 640) / 2);
    currentShape.y2 = constrain(mouseY, (windowHeight - 480) / 2, (windowHeight + 480) / 2);
  }
}

/*
* Function: mouseReleased
* Description: This function will handle the mouse released event
* Parameter: no parameter
* Return: No return
*/
function mouseReleased() {
  // If a shape is currently being drawn, finalize the shape when the mouse button is released
  if (currentShape) {
    items.push(currentShape);
    currentShape = null;
  }
}

/*
* Function: changeTool
* Description: This function will update the current tool and the stamp selection based on the selected option in the tool dropdown menu
* Parameter: no parameter
* Return: No return
*/
function changeTool() {
  // Update the current tool based on the selected option in the tool dropdown menu
  currentTool = toolSelect.value() === 'No Tool' ? null : toolSelect.value();

  // If a tool is selected, clear the current stamp and disable the stamp selection
  if (currentTool) {
    currentStamp = null; // Clear the current stamp
    stampSelect.selected('No Stamp'); // Select the 'No Stamp' option in the stamp dropdown menu
    stampSelect.disable(); // Disable the stamp selection
    if (stampPreview) {
      stampPreview.hide(); // Remove the stamp preview
      stampPreview = null;
    }
  } 
  // If 'No Tool' is selected, enable the stamp selection
  else {
    stampSelect.enable(); // Enable the stamp selection
  }
}

/*
* Function: drawShape
* Description: This function will draw a shape
* Parameter: shape - The shape to be drawn
* Return: No return
*/
function drawShape(shape) {
  // Set the stroke color, fill color, and stroke weight for the shape
  stroke(shape.color);
  fill(shape.fillColor);
  strokeWeight(shape.thickness === 'NONE' ? 0 : shape.thickness);

  // Draw the shape
  if (shape.type === 'Rectangle') {
    // Draw a rectangle with the given corners and dimensions
    rect(shape.x1, shape.y1, shape.x2 - shape.x1, shape.y2 - shape.y1);
  } else if (shape.type === 'Ellipse') {
    // Calculate the width and height of the ellipse
    let width = shape.x2 - shape.x1;
    let height = shape.y2 - shape.y1;
    // Draw an ellipse with the given center and dimensions
    ellipse(shape.x1 + width / 2, shape.y1 + height / 2, Math.abs(width), Math.abs(height));
  }
}

/*
* Function: keyPressed
* Description: This function will handle the key pressed event
* Parameter: no parameter
* Return: No return
*/
function keyPressed() {
  // If the spacebar is pressed, capture the 640x480 area of the video feed and save it as a PNG image
  if (keyCode === 32) { // 32 is the ASCII code for the spacebar
    let img = get((windowWidth - 640) / 2, (windowHeight - 480) / 2, 640, 480); // Capture the 640x480 area of the video feed
    save(img, 'myCanvas.png'); // Save the captured area as a PNG image
  }
}