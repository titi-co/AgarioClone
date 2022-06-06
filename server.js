var blobs = new Map();

var eaten = [];

class Blob {
  constructor(id, x, y, radius, rgb) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.rgb = rgb;
  }
}

var express = require("express");

var port = 3000;

var app = express();
var server = app.listen(process.env.PORT || port, "192.168.1.102", listen);

function listen() {
  var address = server.address();

  console.log(
    "Agar.io is running! http://: " + address.address + ":" + address.port
  );
}

app.use(express.static("public"));

var io = require("socket.io")(server);

setInterval(heartBeat, 10);

function heartBeat() {
  io.sockets.emit("heartbeat", Array.from(blobs.values()), eaten);
}

io.sockets.on("connection", function (socket) {
  console.log("New client joined: " + socket.id);

  socket.on("start", function (data) {
    //console.log(socket.id + " " + data.x + " " + data.y + " " + data.radius);
    var blob = new Blob(socket.id, data.x, data.y, data.radius, data.rgb);

    blobs.set(socket.id, blob);
  });

  socket.on("update", function (data) {
    //console.log(socket.id + " " + data.x + " " + data.y + " " + data.radius);
    if (!eaten.includes(socket.id)) {
      data = { id: socket.id, ...data };
      blobs.set(socket.id, data);
    }
  });

  socket.on("defeat", function (data) {
    eaten.push(data);
    blobs.delete(data);
  });

  socket.on("disconnect", function () {
    console.log("Client disconnected: " + socket.id);
    blobs.delete(socket.id);
  });
});
