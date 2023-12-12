let video;
let filterType = 'NORMAL';
let filterSelect;
let stamps = [];
let stampSelect;
let currentStamp;
let items = [];
let shapes = [];

let stampPreview;
//------------------
let toolSelect;
let currentTool;
let currentShape;
let colorSelect;
let thicknessSelect;
let buffer;



function preload() {
  stamps[0] = createImg("assets/original.png").hide();
  stamps[1] = createImg("assets/approved.png").hide();
  stamps[2] = createImg("assets/stamp.png").hide();
  stamps[3] = createImg("assets/best-seller.png").hide();
  // stamps[4] = createImg("assets/approved.png").hide();

}
function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide(); // Hide the HTML element to draw it on the canvas instead
//----------------------------
  buffer = createGraphics(640, 480); // Create the graphics buffer

  let uiSelection = (windowWidth + 640) / 2 + 190; // Adjust this value as needed
  let uiDescription = (windowWidth + 640) / 2 + 20; // Adjust this value as needed


  // Create the select element
  filterSelect = createSelect();  
  filterSelect.option('No Filter');
  filterSelect.option('INVERT');
  filterSelect.option('POSTERIZE');
  filterSelect.option('GRAY');
  filterSelect.option('BLUR');
  filterSelect.changed(changeFilter);
  createP('Filter:').position(uiDescription,  115);
  filterSelect.position(uiSelection, 130);

  
  stampSelect = createSelect();
  stampSelect.option('No Stamp');
  stampSelect.option('Stamp 1');
  stampSelect.option('Stamp 2');
  stampSelect.option('Stamp 3');
  stampSelect.option('Stamp 4');
  // stampSelect.option('Stamp 5');
  stampSelect.changed(changeStamp);
  createP('Stamp:').position(uiDescription,  145);
  stampSelect.position(uiSelection, 160);


  toolSelect = createSelect();
  toolSelect.option('No Tool');
  toolSelect.option('Rectangle');
  toolSelect.option('Ellipse');
  toolSelect.changed(changeTool);
  createP('Select Shape Tool:').position(uiDescription,  175);
  toolSelect.position(uiSelection, 190);

  thicknessSelect = createSelect();
  thicknessSelect.option('NONE');
  thicknessSelect.option('5');
  thicknessSelect.option('10');
  thicknessSelect.option('15');
  createP('Border Thikness:').position(uiDescription,  205);
  thicknessSelect.position(uiSelection, 220);

  createP('Border Color:').position(uiDescription,  240);
  colorSelect = createColorPicker('#000000'); // for border color
  colorSelect.input(() => console.log('Border color changed:', colorSelect.color()));
  colorSelect.position(uiSelection, 250);

  createP('Shape Color:').position(uiDescription,  275);
  fillColorSelect = createColorPicker('#ffffff'); // for fill color
  fillColorSelect.input(() => console.log('Fill color changed:', fillColorSelect.color()));
  fillColorSelect.position(uiSelection, 285);

  let resetButton = createButton('Reset');
  createP('Reset Stamps & Shapes:').position(uiDescription,  310);
  resetButton.mousePressed(resetSketch);
  resetButton.position(uiSelection, 325);

}

function draw() {
  background(220);
  image(video, (windowWidth - 640) / 2, (windowHeight - 480) / 2); // Draw the video feed in the center of the canvas
  buffer.image(video, 0, 0); // Draw the video feed onto the buffer


    // Apply the selected filter
    if (filterType === 'INVERT') {
      buffer.filter(INVERT);
    } else if (filterType === 'POSTERIZE') {
      buffer.filter(POSTERIZE, 3);
    } else if (filterType === 'GRAY') {
      buffer.filter(GRAY);
    } else if (filterType === 'BLUR') {
      buffer.filter(BLUR, 5);
    }  
  
  image(buffer, (windowWidth - 640) / 2, (windowHeight - 480) / 2); // Draw the buffer onto the canvas

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

  if (currentShape) {
    drawShape(currentShape);
  }
}

function resetSketch() {
  items = []; // Clear all stamps and shapes
  filterType = 'NORMAL'; // Reset the active filter
  filterSelect.selected('No Filter'); // Reset the filter dropdown menu
  currentStamp = null; // Clear the current stamp
  stampSelect.selected('No Stamp'); // Reset the stamp dropdown menu
  stampSelect.enable();
  currentTool = null; // Clear the current tool
  toolSelect.selected('No Tool'); // Reset the tool dropdown menu
  currentShape = null; // Clear the current shape
  thicknessSelect.selected('NONE'); // Reset the thickness dropdown menu
  colorSelect.value('#000000'); // Reset the border color picker
  fillColorSelect.value('#ffffff'); // Reset the fill color picker
  stampPreview.remove(); // Remove the stamp preview
  stampPreview = null;
}

function changeFilter() {
  filterType = filterSelect.value();
}



function changeStamp() {
  let stampIndex = stampSelect.value() === 'No Stamp' ? -1 : parseInt(stampSelect.value().split(' ')[1]) - 1;
  if (currentStamp) {
    currentStamp.hide(); // Hide the previous stamp
  }
  currentStamp = stampIndex === -1 ? null : stamps[stampIndex];
  if (currentStamp) {
    currentStamp.show(); // Show the selected stamp
    stampPreview = currentStamp;
    stampPreview.size(150, 150); // Set the size of the stamp preview
    stampPreview.position(20, 20); // Position the stamp preview
  } else {
    stampPreview.remove(); // Remove the stamp preview
    stampPreview = null;
  }
}
function mousePressed() {
    if (currentStamp && mouseX - currentStamp.width / 2 >= (windowWidth - 640) / 2 && mouseX + currentStamp.width / 2 <= (windowWidth + 640) / 2 && mouseY - currentStamp.height / 2 >= (windowHeight - 480) / 2 && mouseY + currentStamp.height / 2 <= (windowHeight + 480) / 2) {
      items.push({
        type: 'stamp',
        image: currentStamp,
        x: mouseX,
        y: mouseY
      });
    } else if (currentTool && mouseX >= (windowWidth - 640) / 2 && mouseX <= (windowWidth + 640) / 2 && mouseY >= (windowHeight - 480) / 2 && mouseY <= (windowHeight + 480) / 2) {
  
      console.log('Border color:', colorSelect.color());
      console.log('Fill color:', fillColorSelect.color());
      currentShape = {  
        type: currentTool,
        x1: mouseX,
        y1: mouseY,
        x2: mouseX,
        y2: mouseY,
        color: colorSelect.color(),
        fillColor: fillColorSelect.value(), // Use the value() function
        thickness: thicknessSelect.value() === 'NONE' ? 0 : parseInt(thicknessSelect.value()),
      };
      items.push(currentShape);
    }
  }

function mouseDragged() {
  // if (currentShape) {
  //   currentShape.x2 = mouseX;
  //   currentShape.y2 = mouseY;
  // }
  if (currentShape && mouseIsPressed) {
    currentShape.x2 = constrain(mouseX, (windowWidth - 640) / 2, (windowWidth + 640) / 2);
    currentShape.y2 = constrain(mouseY, (windowHeight - 480) / 2, (windowHeight + 480) / 2);
  }

}

function mouseReleased() {
  if (currentShape) {
    items.push(currentShape);
    currentShape = null;
  }
}

function changeTool() {
  currentTool = toolSelect.value() === 'No Tool' ? null : toolSelect.value();
  if (currentTool) {
    currentStamp = null; // Clear the current stamp
    stampSelect.selected('No Stamp'); // Select the 'No Stamp' option in the stamp dropdown menu
    stampSelect.disable(); // Disable the stamp selection
    stampPreview.hide(); // Remove the stamp preview
    stampPreview = null;
  } else {
    stampSelect.enable(); // Enable the stamp selection
  }
}

function drawShape(shape) {
  stroke(shape.color);
  fill(shape.fillColor);
  strokeWeight(shape.thickness === 'NONE' ? 0 : shape.thickness);
  stroke(shape.color);
  fill(shape.fillColor); // Set the fill color
  strokeWeight(shape.thickness);

  if (shape.type === 'Rectangle') {
    rect(shape.x1, shape.y1, shape.x2 - shape.x1, shape.y2 - shape.y1);
  } else if (shape.type === 'Ellipse') {
    let width = shape.x2 - shape.x1;
    let height = shape.y2 - shape.y1;
    ellipse(shape.x1 + width / 2, shape.y1 + height / 2, Math.abs(width), Math.abs(height));
  }

}

function keyPressed() {
  if (keyCode === 32) { // 32 is the ASCII code for the spacebar
    let img = get((windowWidth - 640) / 2, (windowHeight - 480) / 2, 640, 480); // Capture the 640x480 area of the video feed
    save(img, 'myCanvas.png'); // Save the captured area as a PNG image
  }
}
//To-do 
//-Create more constants
//-Write header and function comments, inline comments
//- Double the requirements document again and submit