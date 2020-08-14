// units of time are frames
// units of distance are px

var isRunning = false;
var runningFrameCount = 0;
var xstart = 150;
var xend = 1150;

var a = [0.005, 0.02];
var vm = [3.0, 1.6];

var karts = [];

var decrementVmax0, incrementVmax0;
var decrementA0, incrementA0;
var decrementVmax1, incrementVmax1;
var decrementA1, incrementA1;

let racers = [];

function preload() {
  racers.push(loadImage('figures/dk.png'));
  racers.push(loadImage('figures/toad.png'));
}

function setup() {
  if(windowWidth < 1220 || windowHeight < 600) alert("Please enlarge your window to view the entire canvas.");
  var myCanvas = createCanvas(1220, 600);
  myCanvas.parent("labDiv");

  karts.push(new Kart(a[0], vm[0], 150));
  karts.push(new Kart(a[1], vm[1], 350));

  decrementVmax0 = new CircleButton(17, 105, 10, "-");
  incrementVmax0 = new CircleButton(133, 105, 10, "+");
  decrementA0 = new CircleButton(17, 135, 10, "-");
  incrementA0 = new CircleButton(133, 135, 10, "+");

  decrementVmax1 = new CircleButton(17, 305, 10, "-");
  incrementVmax1 = new CircleButton(133, 305, 10, "+");
  decrementA1 = new CircleButton(17, 335, 10, "-");
  incrementA1 = new CircleButton(133, 335, 10, "+");

  textAlign(CENTER, CENTER);
  textSize(18);
  frameRate(30);
}



function draw() {
  background(220);
  drawStartFinishLines();
  drawControlButtons();

  decrementVmax0.drawButton();
  incrementVmax0.drawButton();
  decrementA0.drawButton();
  incrementA0.drawButton();

  decrementVmax1.drawButton();
  incrementVmax1.drawButton();
  decrementA1.drawButton();
  incrementA1.drawButton();

  if(isRunning) runningFrameCount++;

  fill(0);
  for(var k = 0; k < 2; k++) {
    var xk = xstart + karts[k].getDistance(runningFrameCount);
    image(racers[k], xk, karts[k].y, 70, 70);
    text("vmax="+vm[k].toFixed(1),                         75, karts[k].y-45);
    text("a="+a[k].toFixed(3),                             75, karts[k].y-15);
    text("x="+(xk-xstart).toFixed(0),                      75, karts[k].y+15);
    text("v="+karts[k].getV(runningFrameCount).toFixed(3), 75, karts[k].y+45);
  }

  text("t="+runningFrameCount, width/2, 40);
}


function drawStartFinishLines() {
  stroke(0);
  fill(0);
  strokeWeight(3);
  line(xstart, 10, xstart, height-50);
  line(xend, 10, xend, height-50);
  strokeWeight(0);
  text("start", xstart, height-25);
  text("finish", xend, height-25);
}


function drawControlButtons() {
  fill(70, 220, 70);
  rect(0, height-30, 30, 30);
  fill(220, 70, 70);
  rect(30, height-30, 30, 30);
  fill(70, 70, 220);
  rect(60, height-30, 30, 30);

  fill(178, 97, 208);
  rect(width/2 - 34, height-30, 30, 30);
  rect(width/2 + 4, height-30, 30, 30);
}



function mouseClicked() {
  if(mouseX < 30 && mouseY > height-30) {
    isRunning = true;
    karts.length = 0;
    karts.push(new Kart(a[0], vm[0], 150));
    karts.push(new Kart(a[1], vm[1], 350));
  }

  else if(mouseX > 30 && mouseX < 60 && mouseY > height-30) {
    isRunning = false;
    runningFrameCount = 0;
  }

  else if(mouseX > 60 && mouseX < 90 && mouseY > height-30) isRunning = false;

  else if(mouseX > width/2 - 34 && mouseX < width/2 - 4 && mouseY > height-30) runningFrameCount--;
  else if(mouseX > width/2 + 4 && mouseX < width/2 + 34 && mouseY > height-30) runningFrameCount++;

  else if(decrementVmax0.getDistance(mouseX, mouseY) < decrementVmax0.r) vm[0] -= 0.1;
  else if(incrementVmax0.getDistance(mouseX, mouseY) < incrementVmax0.r) vm[0] += 0.1;
  else if(decrementA0.getDistance(mouseX, mouseY) < decrementA0.r) a[0] -= 0.005;
  else if(incrementA0.getDistance(mouseX, mouseY) < incrementA0.r) a[0] += 0.005;

  else if(decrementVmax1.getDistance(mouseX, mouseY) < decrementVmax1.r) vm[1] -= 0.1;
  else if(incrementVmax1.getDistance(mouseX, mouseY) < incrementVmax1.r) vm[1] += 0.1;
  else if(decrementA1.getDistance(mouseX, mouseY) < decrementA1.r) a[1] -= 0.005;
  else if(incrementA1.getDistance(mouseX, mouseY) < incrementA1.r) a[1] += 0.005;
}




class CircleButton {
  constructor(x, y, r, label) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.label = label
  }
  drawButton() {
    fill(255);
    ellipse(this.x, this.y, 2*this.r, 2*this.r);
    fill(0);
    text(this.label, this.x, this.y);
  }
  getDistance(x, y) {
    return sqrt(pow(this.x - x, 2) + pow(this.y - y, 2));
  }
}


class Kart {
  constructor(a, vmax, y) {
    this.a = a;
    this.vmax = vmax;
    this.y = y;
  }
  getDistance(frames) {
    var time2vmax = this.vmax/this.a;
    if(frames < time2vmax) return 0.5*this.a*frames*frames;
    else return 0.5*this.a*time2vmax*time2vmax + this.vmax*(frames-time2vmax);
  }
  getV(frames) {
    if(this.a*frames < this.vmax) return this.a*frames;
    else return this.vmax;
  }
}
