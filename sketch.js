let video;
let filterType = 'NORMAL';
let filterSelect;
let stamps = [];
let stampSelect;
let currentStamp;
let items = [];
let stampPreview;
//------------------
let toolSelect;
let currentTool;
let currentShape;
let colorSelect;
let thicknessSelect;


function preload() {
  stamps[0] = createImg("assets/original.png").hide();
  stamps[1] = createImg("assets/approved.png").hide();
  stamps[2] = createImg("assets/stamp.png").hide();
  stamps[3] = createImg("assets/best-seller.png").hide();
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide(); // Hide the HTML element to draw it on the canvas instead

  // Create the select element
  filterSelect = createSelect();
  filterSelect.option('No Filter');
  filterSelect.option('INVERT');
  filterSelect.option('POSTERIZE');
  filterSelect.option('GRAY');
  filterSelect.option('BLUR');
  filterSelect.changed(changeFilter);

  
  stampSelect = createSelect();
  stampSelect.option('No Stamp');
  stampSelect.option('Stamp 1');
  stampSelect.option('Stamp 2');
  stampSelect.option('Stamp 3');
  stampSelect.option('Stamp 4');
  stampSelect.changed(changeStamp);

  toolSelect = createSelect();
  toolSelect.option('No Tool');
  toolSelect.option('Rectangle');
  toolSelect.option('Ellipse');
  toolSelect.changed(changeTool);

  thicknessSelect = createSelect();
  thicknessSelect.option('5');
  thicknessSelect.option('10');
  thicknessSelect.option('15');
  thicknessSelect.option('20');


  colorSelect = createColorPicker('#000000'); // for border color
  colorSelect.input(() => console.log('Border color changed:', colorSelect.color()));

  fillColorSelect = createColorPicker('#ffffff'); // for fill color
  fillColorSelect.input(() => console.log('Fill color changed:', fillColorSelect.color()));

  let resetButton = createButton('Reset');
  resetButton.mousePressed(resetSketch);

  // thicknessSelect = createSlider(0, 10, 1);

}

function draw() {
  background(220);
  image(video, (windowWidth - 640) / 2, (windowHeight - 480) / 2); // Draw the video feed in the center of the canvas

  // Apply the selected filter
  if (filterType === 'INVERT') {
    filter(INVERT);
  } else if (filterType === 'POSTERIZE') {
    filter(POSTERIZE, 3);
  } else if (filterType === 'GRAY') {
    filter(GRAY);
  } else if (filterType === 'BLUR') {
    filter(BLUR, 5);
  }  

  if (currentStamp && mouseX >= (windowWidth - 640) / 2 && mouseX <= (windowWidth + 640) / 2 && mouseY >= (windowHeight - 480) / 2 && mouseY <= (windowHeight + 480) / 2) {
    image(currentStamp, mouseX - currentStamp.width / 2, mouseY - currentStamp.height / 2);
  }

  for (let item of items) {
    if (item.type === 'stamp') {
      image(item.image, item.x - item.image.width / 2, item.y - item.image.height / 2);
    } else if (item.type === 'Rectangle' || item.type === 'Ellipse') {
      drawShape(item);
    }
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
  currentTool = null; // Clear the current tool
  toolSelect.selected('No Tool'); // Reset the tool dropdown menu
  currentShape = null; // Clear the current shape
  thicknessSelect.selected('1'); // Reset the thickness dropdown menu
  colorSelect.value('#000000'); // Reset the border color picker
  fillColorSelect.value('#ffffff'); // Reset the fill color picker
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
    stampPreview = createImg('');
    stampPreview.size(150, 150); // Set the size of the stamp preview
    stampPreview.position(20, 20); // Position the stamp preview
  }
}

// function mousePressed() {
//   if (currentStamp && mouseX >= (windowWidth - 640) / 2 && mouseX <= (windowWidth + 640) / 2 && mouseY >= (windowHeight - 480) / 2 && mouseY <= (windowHeight + 480) / 2) {
//     items.push({
//       type: 'stamp',
//       image: currentStamp,
//       x: mouseX,
//       y: mouseY
//     });
//   }
// }

// function mousePressed() {
//   if (mouseX >= (windowWidth - 640) / 2 && mouseX <= (windowWidth + 640) / 2 && mouseY >= (windowHeight - 480) / 2 && mouseY <= (windowHeight + 480) / 2) {
//     if (currentStamp) {
//       items.push({
//         type: 'stamp',
//         image: currentStamp,
//         x: mouseX,
//         y: mouseY
//       });
//     } else if (currentTool) {
//       currentShape = {
//         type: currentTool,
//         x1: mouseX,
//         y1: mouseY,
//         x2: mouseX,
//         y2: mouseY,
//         color: colorSelect.color(),
//         thickness: thicknessSelect.value()
//       };
//     }
//   }
// }
function mousePressed() {
  if (mouseX >= (windowWidth - 640) / 2 && mouseX <= (windowWidth + 640) / 2 && mouseY >= (windowHeight - 480) / 2 && mouseY <= (windowHeight + 480) / 2) {
    if (currentStamp) {
      items.push({
        type: 'stamp',
        image: currentStamp,
        x: mouseX,
        y: mouseY
      });
    } else if (currentTool) {
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
        thickness: thicknessSelect.value(), // Use the value() function
        thickness: parseInt(thicknessSelect.value()),
  
    
      };
    }
  }
}


function mouseDragged() {
  if (currentShape) {
    currentShape.x2 = mouseX;
    currentShape.y2 = mouseY;
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
}

// function drawShape(shape) {
//   stroke(shape.color);
//   strokeWeight(shape.thickness);
//   if (shape.type === 'Rectangle') {
//     rect(shape.x1, shape.y1, shape.x2 - shape.x1, shape.y2 - shape.y1);
//   } else if (shape.type === 'Ellipse') {
//     ellipse(shape.x1, shape.y1, shape.x2 - shape.x1, shape.y2 - shape.y1);
//   }
// }
// function drawShape(shape) {
//   stroke(shape.color);
//   strokeWeight(shape.thickness);

//   stroke(shape.color);
//   fill(shape.fillColor); // Set the fill color
//   strokeWeight(shape.thickness);

//   if (shape.type === 'Rectangle') {
//     rect(shape.x1, shape.y1, shape.x2 - shape.x1, shape.y2 - shape.y1);
//   } else if (shape.type === 'Ellipse') {
//     let width = shape.x2 - shape.x1;
//     let height = shape.y2 - shape.y1;
//     ellipse(shape.x1 + width / 2, shape.y1 + height / 2, Math.abs(width), Math.abs(height));
//   }


// }
function drawShape(shape) {
  // Convert the color strings to p5.Color objects
  stroke(color(shape.color));
  fill(color(shape.fillColor));

  strokeWeight(shape.thickness);

  if (shape.type === 'Rectangle') {
    rect(shape.x1, shape.y1, shape.x2 - shape.x1, shape.y2 - shape.y1);
  } else if (shape.type === 'Ellipse') {
    let width = shape.x2 - shape.x1;
    let height = shape.y2 - shape.y1;
    ellipse(shape.x1 + width / 2, shape.y1 + height / 2, Math.abs(width), Math.abs(height));
  }
}

//To-do 
//-Create the image feaure
//-The ellipse is drawing from the center, not from the corner, change it to draw from the corner
//-When the stamp is selected and hovers over the shape, the stamp is under the shape layer, but when drawing it, it gets drawn over the shape, fix it. 
//-Create more constants
//-Move some code to functions
//-Write header and function comments, inline comments
