let centerX, centerY;
let lastX = -999,
  lastY = -999;
let drawing = false;
let song;
let songStarted = false;
let amp;

let stars = [];
let lines = [];
let smoothedLevel = 0;

function preload() {
  song = loadSound("assets/music/spaceymusic.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight).parent("p5container");
  centerX = width / 2;
  centerY = height / 2;
  colorMode(RGB, 255, 255, 255, 1);
  strokeWeight(2);

  amp = new p5.Amplitude();

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

  for (let s of stars) {
    s.x += s.speedX;
    s.y += s.speedY;
    if (s.x < 0) s.x = width;
    if (s.x > width) s.x = 0;
    if (s.y < 0) s.y = height;
    if (s.y > height) s.y = 0;

    s.opacity += s.blinkSpeed;
    if (s.opacity > 0.9 || s.opacity < 0.2) s.blinkSpeed *= -1;

    fill(255, 255, 255, s.opacity);
    ellipse(s.x, s.y, s.r);
  }

  let pulse = 1;
  if (songStarted) {
    let level = amp.getLevel() * 6;
    smoothedLevel = lerp(smoothedLevel, level, 0.05);
    pulse = map(smoothedLevel, 0, 0.3, 0.95, 1.2);
  }

  for (let l of lines) {
    let x1p = centerX + (l.x1 - centerX) * pulse;
    let y1p = centerY + (l.y1 - centerY) * pulse;
    let x2p = centerX + (l.x2 - centerX) * pulse;
    let y2p = centerY + (l.y2 - centerY) * pulse;

    drawingContext.shadowBlur = map(smoothedLevel, 0, 0.3, 0, 20);
    drawingContext.shadowColor = color(l.r, l.g, l.b);

    stroke(l.r, l.g, l.b);
    line(x1p, y1p, x2p, y2p);
  }

  if (drawing && songStarted) {
    let speed = dist(mouseX, mouseY, pmouseX, pmouseY);
    let playbackRate = map(speed, 0, 50, 0.8, 1.3);
    playbackRate = constrain(playbackRate, 0.8, 1.3);
    song.rate(playbackRate);
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

  lines.push({ x1, y1, x2, y2, r, g, b });

  lastX = x1;
  lastY = y1;
}

function mousePressed() {
  if (!songStarted && song.isLoaded()) {
    song.loop(0, 1, 0.3, 60);
    amp.setInput(song);
    songStarted = true;
  }
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
