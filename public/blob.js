class Blob {
  constructor(radius, x, y) {
    this.pos = createVector(x, y);
    this.radius = radius;
    this.vel = createVector(0, 0);

    this.ctr = random(1000);

    var colors = [
      "#77ff00",
      "#2600ff",
      "#00ddff",
      "#ffff00",
      "#ff0900",
      "#ff5100",
      "#ffbb00",
      "#8cff00",
      "#fafafa",
    ];

    this.rgb = colors[floor(random(colors.length - 1))];
    /*
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    */

    this.update = function () {
      var newVel = createVector(mouseX - width / 2, mouseY - height / 2);
      newVel.setMag(3);
      this.vel.lerp(newVel, 0.25);
      this.pos.add(this.vel);
    };

    this.eat = function (foodBlob) {
      var distance = p5.Vector.dist(this.pos, foodBlob.pos);

      if (distance < this.radius + foodBlob.radius) {
        var sum =
          PI * this.radius * this.radius +
          PI * foodBlob.radius * foodBlob.radius;
        this.radius = sqrt(sum / PI);

        return true;
      }

      return false;
    };

    this.defeat = function (x, y, radius) {
      var enemyPos = createVector(x, y);
      var distance = p5.Vector.dist(this.pos, enemyPos);

      if (distance < this.radius + radius) {
        var sum = PI * this.radius * this.radius + PI * radius * radius;
        this.radius = sqrt(sum / PI);

        return true;
      }

      return false;
    };

    this.constrain = function (worldSize) {
      blob.pos.x = constrain(blob.pos.x, -worldSize, worldSize);
      blob.pos.y = constrain(blob.pos.y, -worldSize, worldSize);
    };

    this.showBlob = function (isPlayer) {
      fill(this.rgb);
      stroke(pSBC(-0.25, this.rgb));
      if (isPlayer) {
        push();
        strokeWeight(this.radius / 6);
        translate(this.pos.x, this.pos.y);
        beginShape();
        for (var a = 0; a < TWO_PI; a += PI / 200) {
          var cos_a = cos(a),
            sin_a = sin(a),
            noi = noise(cos_a + 1, sin_a + 1, this.ctr),
            d = this.radius + map(noi, 0, 1, -10, 10);
          vertex(d * cos_a, d * sin_a);
        }
        endShape();
        pop();
        this.ctr += 0.025;
      } else {
        strokeWeight(5);
        ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
      }
    };
  }
}
