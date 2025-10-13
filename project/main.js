let centerX, centerY;
let lastX = -999,
  lastY = -999;
let drawing = false;
let glitterChance = 0.1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  background(5, 5, 25);
  colorMode(RGB, 255, 255, 255, 1);
  strokeWeight(2);
}

function draw() {
  if (drawing) {
    let dx = mouseX - centerX;
    let dy = mouseY - centerY;
    let radius = sqrt(dx * dx + dy * dy);
    let angle = atan2(dy, dx);

    let x1 = centerX + radius * cos(angle);
    let y1 = centerY + radius * sin(angle);
    let x2 = centerX + radius * cos(angle + PI);
    let y2 = centerY + radius * sin(angle + PI);

    let r = map(dx, -width / 2, width / 2, 50, 255);
    let g = map(dy, -height / 2, height / 2, 50, 255);
    let b = map(radius, 0, sqrt(sq(width / 2) + sq(height / 2)), 80, 255);

    stroke(r, g, b);
    line(x1, y1, x2, y2);

    if (lastX > -999) {
      line(x1, y1, lastX, lastY);
    }

    if (random() < glitterChance) {
      push();
      stroke(255, 255, 255, 0.8);
      strokeWeight(random(1, 3));
      point(x1 + random(-3, 3), y1 + random(-3, 3));
      point(x2 + random(-3, 3), y2 + random(-3, 3));
      pop();
    }

    lastX = x1;
    lastY = y1;
  }
}

function mousePressed() {
  drawing = true;
  lastX = -999;
  lastY = -999;
}

function mouseReleased() {
  drawing = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
