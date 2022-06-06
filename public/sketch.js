var blob;
var defaultBlobSize = 64;
var defaultFoodBlobSize = 8;

var foodBlobs = [];

var enemyBlobs = [];

var eatenIDs = [];

var nBlobs = 500;

var zoom = 1;

var socket;

var worldSize = 2000;

function setup() {
  createCanvas(windowWidth, windowHeight);

  socket = io.connect("http://192.168.1.102:3000");

  blob = new Blob(defaultBlobSize, 0, 0);

  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    radius: blob.radius,
    rgb: blob.rgb,
  };

  socket.emit("start", data);

  socket.on("heartbeat", function (data, eaten) {
    //console.log(data);
    enemyBlobs = data;
    eatenIDs = eaten;
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  if (!eatenIDs.includes(socket.id)) {
    background(240);

    translate(width / 2, height / 2);
    var newZoom = defaultBlobSize / blob.radius;
    zoom = lerp(zoom, newZoom, 0.1);
    scale(zoom);
    translate(-blob.pos.x, -blob.pos.y);

    for (var i = foodBlobs.length - 1; i >= 0; i--) {
      foodBlobs[i].showBlob(false);
      if (blob.eat(foodBlobs[i])) {
        foodBlobs.splice(i, 1);
      }
    }

    for (var i = enemyBlobs.length - 1; i >= 0; i--) {
      var id = enemyBlobs[i].id;

      if (id !== socket.id) {
        var x = enemyBlobs[i].x;
        var y = enemyBlobs[i].y;
        var rgb = enemyBlobs[i].rgb;
        var radius = enemyBlobs[i].radius;

        drawEnemy(x, y, rgb, radius, 1000);

        if (blob.radius > radius + 10 && blob.defeat(x, y, radius)) {
          socket.emit("defeat", id);
        }
      }
    }

    if (foodBlobs.length < nBlobs) {
      var x = random(-worldSize, worldSize);
      var y = random(-worldSize, worldSize);
      foodBlobs.push(new Blob(defaultFoodBlobSize, random(x), random(y)));
    }

    blob.showBlob(true);
    blob.update();
    blob.constrain(worldSize);

    var data = {
      x: blob.pos.x,
      y: blob.pos.y,
      radius: blob.radius,
      rgb: blob.rgb,
    };
    socket.emit("update", data);
  } else {
    console.log("Game ended for this client!");
    background(0);
  }
}
