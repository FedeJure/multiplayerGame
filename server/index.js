const path = require('path');
const jsdom = require('jsdom');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const Datauri = require('datauri');
const datauri = new Datauri();
const { JSDOM } = jsdom;

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
function setupAuthoritativePhaser() {
  JSDOM.fromFile(path.join(__dirname, 'authoritative_server/index.html'), {
    // To run the scripts in the html file
    runScripts: "dangerously",
    // Also load supported external resources
    resources: "usable",
    // So requestAnimatinFrame events fire
    pretendToBeVisual: true
  }).then((dom) => {
    dom.window.URL.createObjectURL = (blob) => {
      if (blob) {
        return datauri.format(blob.type, blob[Object.getOwnPropertySymbols(blob)[0]]._buffer).content;
      }
    };
    dom.window.URL.revokeObjectURL = (objectURL) => { };
    dom.window.gameLoaded = () => {
      let port = process.env.PORT;
      if (port == null || port == "") {
        port = 8082;
      }
      server.listen(port, function () {
        console.log(`Listening on ${server.address().port}, ${JSON.stringify(server.address())}`);
      });
    };


    io.on('connection', function (socket) {
      console.log('a user connected');
      socket.on('disconnect', function () {
        console.log('user disconnected');
      });
    }); dom.window.io = io;
  }).catch((error) => {
    console.log(error.message);
  });
}

setupAuthoritativePhaser();