let video;
let filterType = 'NORMAL';
let filterSelect;
let stamps = [];
let stampSelect;
let currentStamp;
let items = [];
let stampPreview;

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

  // stampPreview = createImg('');
  // stampPreview.size(150, 150); // Set the size of the stamp preview
  // stampPreview.position(20, 20); // Position the stamp preview

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
    }
    // Add code here to handle other types of items (e.g., shapes)
  }
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

function mousePressed() {
  if (currentStamp && mouseX >= (windowWidth - 640) / 2 && mouseX <= (windowWidth + 640) / 2 && mouseY >= (windowHeight - 480) / 2 && mouseY <= (windowHeight + 480) / 2) {
    items.push({
      type: 'stamp',
      image: currentStamp,
      x: mouseX,
      y: mouseY
    });
  }
}