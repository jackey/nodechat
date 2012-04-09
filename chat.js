#!/usr/bin/env node

var net = require('net');
var server = net.createServer();

server.on('connection', function (socket) {
  newConnection(socket);
});

server.on('close', function() {
  console.log('server is closed.');
});

server.on('error', function () {
  console.log('server failed.');
});

server.on('listening', function () {
  console.log('server is listening at 8888');
});

server.listen(8888);

// Global storage for clients.
var clients = [];
var commands = require('./commands')(clients);
function newConnection(socket) {
  socket.setEncoding('utf8');
  socket.on('data', function (data) {
    handlerOnSocketData(socket, data);
  });
  socket.on('error', function (error) {
    socket.destory();
    handlerOnScoketError(socket, error);
  });
}

function handlerOnSocketData(socket, data) {
  var str = data.toString().replace(/\r\n/g, '');
  var match = str.match(/^\/(\S+)\s*(.*)$/);
  if (match) {
    var command = match[1];
    if (commands[command]) {
      commands[command](socket, match[2]);
    }
    else {
      socket.write('Command not supported!');
    }
  }
  else {
    socket.write('Missed command.');
  }
}

function handlerOnScoketError(socket, error) {
  // TODO: handle socket error.
}

function handlerOnSocketTimeOut(socket, data) {
  // TODO: handle socket timeout.
}

function handlerOnSocketClose(socket, data) {
  // TODO: handle socket closed.
}