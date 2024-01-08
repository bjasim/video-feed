# Photobooth Program README

## Description

This Python program allows users to create a "photobooth" experience by editing and drawing on a live video feed from their webcam and saving the edited image to their local machine. The program provides various features, including video display, GUI elements for selecting filters and drawing tools, and the ability to save the edited image.

## Features

### Canvas
- The application fills the browser window.
- The live video feed and user drawing are displayed in a 640 x 480 rectangle centered on the canvas.
- GUI elements for tools are placed outside the video stream area without overlapping it.

### Video
- The video capture is set to obtain a 640 x 480 stream from the camera.
- The captured image is centered horizontally and vertically in the browser window.
- The captured image updates continuously while the program is running and is drawn underneath any added shapes or stamps.

### Filters
- Users can apply the following filters to the video feed:
  - Invert
  - Posterize
  - Gray
  - Blur
- There is an option to select NO filter.
- Filters are applied only to the video feed and not to the shapes or stamps.

### Stamps
- Users can choose from 4 different images to "stamp" onto the video feed.
- Stamps are limited to a maximum size of 150 x 150 pixels.
- Only one stamp can be selected at a time.
- When a stamp is selected, it is drawn centered at the current mouse position when the mouse is over the video stream area.
- Clicking within the video stream area adds the stamp centered at the mouse position, staying within the stream area and not overlapping the tool area.
- Stamps are drawn in front of other stamps or shapes created before them and behind anything drawn after them.
- The UI elements for stamp selection display the stamp image.
- The currently selected stamp is visible in some manner.

### Rectangle and Ellipse Tools
- Users can draw rectangles and ellipses on the video area.
- When the mouse is pressed within the video stream area with one of these tools selected, the first corner of the shape is set.
- As the mouse is moved, the shape is drawn with one corner at the mouse down position and the other corner at the current mouse position.
- Releasing the mouse button finalizes the shape, which will be drawn over the video capture.
- Users can select the border and fill color of the shapes being drawn.
- Users can choose from 4 border thicknesses, including NONE.
- All shapes and stamps are drawn in the order they were created.

### Reset
- A button allows users to clear all stamps and shapes, reset any active filters, and display the raw video feed again.

### Image Capture
- When the spacebar is pressed, the current contents of the video stream, with all filters, stamps, and shapes applied, are saved to a PNG image.
- The saved image only contains the 640 x 480 area of the video stream, excluding UI elements.

## Usage

1. Clone or download this repository to your local machine.
2. Link to the preview: https://bjasim.github.io/video-feed/
