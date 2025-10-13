let centerX, centerY;
let lastX = -999,
  lastY = -999;
let drawing = false;

//array to store stars
let stars = [];

//array to store drawn lines
let lines = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  colorMode(RGB, 255, 255, 255, 1);
  strokeWeight(2);

  //create blinking and floating stars
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      r: random(0.5, 2),
      opacity: random(0.2, 0.8),
      speedX: random(-0.2, 0.2),
      speedY: random(-0.2, 0.2),
      blinkSpeed: random(0.005, 0.02),
    });
  }
}

function draw() {
  background(0);

  noStroke();
  //update and draw all stars
  for (let s of stars) {
    s.x += s.speedX;
    s.y += s.speedY;

    //wrap stars when they leave the screen
    if (s.x < 0) s.x = width;
    if (s.x > width) s.x = 0;
    if (s.y < 0) s.y = height;
    if (s.y > height) s.y = 0;

    //star blinking effect
    s.opacity += s.blinkSpeed;
    if (s.opacity > 0.9 || s.opacity < 0.2) s.blinkSpeed *= -1;

    fill(255, 255, 255, s.opacity);
    ellipse(s.x, s.y, s.r);
  }

  //draw all saved lines
  for (let l of lines) {
    stroke(l.r, l.g, l.b);
    line(l.x1, l.y1, l.x2, l.y2);
  }
}

function mouseDragged() {
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

  //save the line into the array
  lines.push({ x1, y1, x2, y2, r, g, b });

  lastX = x1;
  lastY = y1;
}

function mousePressed() {
  drawing = true;
  lastX = -999;
  lastY = -999;
}

function mouseReleased() {
  drawing = false;
  lastX = -999;
  lastY = -999;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
