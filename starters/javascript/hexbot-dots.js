let canvas;
let ctx;
let appWidth;
let appHeight;

let positionX = 100;
let positionY = 100;
let letter;

// called by NOOPBOT on window.onload
function start_app() {

  // size canvas to window
  sizeCanvas();

  //set up a ticker to refresh page automatically.
  let speed = 5000; // how often screen refreshes, in milliseconds.
  let ticker = NOOPBOT_TICK_SETUP(draw, speed);

  //fire a draw event.
  draw();

  //redraw when canvas is clicked.
  canvas.addEventListener('click', backStatus);
  document.addEventListener('keydown', logKey);

  function logKey(e) {
    console.log(e.key);
    letter = e.key;
    getColor();
  }

}


function getColor() {
  //get the color!
  NOOPBOT_FETCH({
    API: 'hexbot',
    count: 1,
    width: appWidth,
    height: appHeight,
  }, drawLetter);
}


function backStatus(){
  ctx.restore();
}

function sizeCanvas() {
  appWidth = window.innerWidth;
  appHeight = window.innerHeight;
  canvas = document.getElementById('canvas');
  ctx = NOOPBOT_SETUP_CANVAS( { canvas: canvas, bgColor:'#ffffff' });
}

function draw() {
  //get the data!
  NOOPBOT_FETCH({
    API: 'hexbot',
    count: 1,
    width: appWidth,
    height: appHeight,
  }, drawSet);
}

function drawSet(responseJson) {
  let { colors } = responseJson;
  colors.forEach(function(point) {
    drawPoint(ctx, point);
  })
}


function drawLetter(point){

  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = point.value;
  ctx.textAlign = "center";
  ctx.fillText(letter, positionX, positionY);
  positionX=positionX+15;

  if(positionX >= window.innerHeight - 100){
    positionY = positionY + 30;
    positionX = 100;
  }

}

function drawPoint(ctx, point) {
  ctx.fillStyle = point.value;
  let pointSize = 5;
  //ctx.globalAlpha = Math.random();
  ctx.beginPath();
  ctx.arc(point.coordinates.x, point.coordinates.y, pointSize, 0, Math.PI * 2, true);
  ctx.fill();
}

// listen if browser changes size.
window.onresize = function(event){
  sizeCanvas();
  draw();
};
