/* constructor: creates a new slider with default values.
if min and max are not defined, they are set to 0.
min: min value of the slider
max: max value of the slider
value: initially set to 0, the current value of the slider
colors used for visual representation
*/
function Slider (min, max, value) {
  this.min = (min === undefined) ? 0 : min;
  this.max = (max === undefined) ? 0 : max;
  this.value = (value === undefined) ? 0 : value;
  this.onchange = null;
  this.x = 0;
  this.y = 0;
  this.width = 16;
  this.height = 100;
  this.backColor = "#cccccc";
  this.backBorderColor = "#999999";
  this.backWidth = 4;
  this.backX = this.width / 2 - this.backWidth / 2;
  this.handleColor = "#eeeeee";
  this.handleBorderColor = "#cccccc";
  this.handleHeight = 6;
  this.handleY = 0;
  this.updatePosition();
}

/* draws the slider using rectangular paths (for both the slider's
structure and the handle ) */
Slider.prototype.draw = function(context){
  context.save();
  context.translate(this.x, this.y);
  context.fillStyle = this.backColor;
  context.beginPath();
  context.fillRect(this.backX, 0, this.backWidth, this.height);
  context.closePath();
  context.strokeStyle = this.handleBorderColor;
  context.fillStyle = this.handleColor;
  context.beginPath();
  context.rect(0, this.handleY, this.width, this.handleHeight);
  context.closePath();
  context.fill();
  context.stroke();
  context.restore();
};

/* updates the slider's value. If a change on the slider's value occurs
the parameter onchange ceases to be null which may be used as a flag */
Slider.prototype.updateValue = function(){
  var old_value = this.value,
      handleRange = this.height - this.handleHeight,
      valueRange = this.max - this.min;

  this.value = (handleRange - this.handleY) / handleRange *
                valueRange + this.min;

  if(typeof this.onchange === 'function' && this.value !== old_value) {
    this.onchange();
  }
};

//updates the Y position of the handle (the X position is always the same).
Slider.prototype.updatePosition = function(){
  var handleRange = this.height - this.handleHeight,
      valueRange = this.max - this.min;

  this.handleY = handleRange - ((this.value - this.min) / valueRange) * handleRange;
};

//
Slider.prototype.captureMouse = function(element) {
  var self = this,
      mouse = utils.captureMouse(element),
      bounds = {};

  setHandleBounds();

  /*event listeners for mousedown, up and move.
  only does something when the mouse is pressed (mousedown)
  inside the handler's bounds*/
  element.addEventListener('mousedown', function(){
    if(utils.containsPoint(bounds,mouse.x,mouse.y)) {
      element.addEventListener('mouseup', onMouseUp, false);
      element.addEventListener('mousemove', onMouseMove, false);
    }
  }, false);

  function onMouseUp() {
      element.removeEventListener('mousemove',onMouseMove, false);
      element.removeEventListener('mouseup',onMouseUp, false);
      setHandleBounds();
  }

  //updates handler values when there is an update in the mouse position
  //with the mouse clicked.
  function onMouseMove() {
    var pos_y = mouse.y - self.y;
    self.handleY = Math.min(self.height - self.handleHeight, Math.max(pos_y,0));
    self.updateValue();
  }

  //sets handle bounds, considering its x and y coordinates, width and height
  function setHandleBounds() {
    bounds.x = self.x;
    bounds.y = self.y + self.handleY;
    bounds.width = self.width;
    bounds.height = self.handleHeight;
  }
};
