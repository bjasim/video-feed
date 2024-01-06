Video Feed Display: The script creates a video feed that is displayed in the middle of the canvas. 
The video feed is captured using the createCapture(VIDEO) function from the p5.js library.
Filters: The script allows users to apply filters to the video feed. 
The available filters are 'No Filter', 'Invert', 'Posterize', 'Gray', and 'Blur'. 
The selected filter is applied to the video feed using the filter() function from the p5.js library.
Stamps: Users can select a stamp from a dropdown menu and place it on the video feed. The stamps are loaded in the preload() function and stored in an array. The selected stamp is displayed at the mouse position when the mouse button is pressed.
Shapes: Users can select a shape tool from a dropdown menu and draw shapes on the video feed.
The available tools are 'No Tool', 'Rectangle', and 'Ellipse'. The selected tool is used to draw a shape starting from the mouse position when the mouse button is pressed. The shape continues to be drawn as long as the mouse button is held down and the mouse is moved.
Color and Thickness Selection: Users can select the color and thickness of the shape border using color pickers and a dropdown menu. 
The selected color and thickness are used when drawing the shape.
Reset Button: There is a 'Reset' button that resets the sketch to its initial state. 
This clears all stamps and shapes, resets the active filter, and clears the current stamp and tool.
Screenshot Capture: If the spacebar is pressed, the script captures the 640x480 area of the video feed and saves it as a PNG image.
These features make the sketch.js file a comprehensive script for a video feed application that allows users to interactively modify the video feed by applying filters, placing stamps, and drawing shapes.


Link to the preview: https://bjasim.github.io/video-feed/
