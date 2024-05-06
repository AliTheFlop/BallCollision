let allParticles = [];
const HEIGHT = 800;
const WIDTH = 1200;
let colors = [
  [255, 87, 51],   // Coral Red
  [255, 71, 87],   // Deep Pink
  [30, 144, 255],  // Dodger Blue
  [255, 215, 0],   // Gold
  [0, 206, 209]    // Dark Turquoise
];

function checkCircleCollision(c1, c2) {
  var a = c1.pos.x - c2.pos.x;
  var b = c1.pos.y - c2.pos.y;
  var c = (a * a) + (b * b);
  var radii = (c1.length / 2) + (c2.length / 2);
  
  if (radii * radii >= c) {
    // Circles are colliding, calculate separation distance
    var distance = Math.sqrt(c);
    var overlap = radii - distance;
    var separationDistance = overlap / 2;

    var separationX = (a / distance) * separationDistance;
    var separationY = (b / distance) * separationDistance;

    c1.pos.x += separationX;
    c1.pos.y += separationY;
    c2.pos.x -= separationX;
    c2.pos.y -= separationY;

    c1.health = c1.health - 5;
    c2.health = c2.health - 5;

    return true;
  }
  
  return false;
}


class Walker{
  constructor(x, y, vel, length){
    this.pos = createVector(x,y);
    this.vel = vel;
    this.speed = 1;
    this.velX = random(-3,3);
    this.velY = random(-1,3);
    this.length = length;
    this.col = random(colors);
    this.prevPos = this.pos.copy();

    //change to whatevs. It loses 5 per hit on another circle. 50k is basically invincible
    this.health = 50000;
  }

  update(){
    if ((this.pos.x + this.vel * this.velX * this.speed) < 0) {
      this.velX *= -1;
    } else if ((this.pos.y + this.vel * this.velY * this.speed) < 0) {
      this.velY *= -1;
    } else if ((this.pos.x + this.vel * this.velX * this.speed) > WIDTH) {
      this.velX *= -1;
    } else if ((this.pos.y + this.vel * this.velY * this.speed) > HEIGHT) {
      this.velY *= -1;
    }

    if(this.velX === 0 || this.velY === 0){
      this.velX = random(-1,1);
      this.velY = random(-1,1);
    }
    
    if(this.health != 50000 && this.health <= 0){
      allParticles.splice(allParticles.indexOf(this), 1);
    }

    if(this.speed > 1){
      this.speed = this.speed - 0.01;
    }
    for (let other of allParticles) {
      if (other !== this && checkCircleCollision(this, other)) {
        // Collision detected, handle accordingly
        this.speed = 2;
        this.velX *= -1;
        this.velY *= -1;
        other.velX *= -1;
        other.velY *= -1;
      }
    }

    this.pos.x += this.vel * this.velX * this.speed;
    this.pos.y += this.vel * this.velY * this.speed;
  }

  display(){
    noStroke();
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, this.length, this.length);

    stroke(this.col);
    strokeWeight(this.length/2);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);

    this.prevPos = this.pos.copy();
  }
}

function mousePressed(){
  allParticles.push(new Walker(mouseX, mouseY, random(5,10), floor(random(10,20))));
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(60);
  for(let i = 0; i < 25; i++){
    allParticles.push(new Walker(random(10,HEIGHT), random(10,HEIGHT), random(5,10), floor(random(10,20))));
  }
}

function draw() {
  background(220);
  for (let i of allParticles){
    i.update();
    i.display();
  }

}
