// Commands API
module.exports = function (clients) {
  var commands = {};
  
  // Send message to UID.
  // Syntax: /send uid msg
  // Example: /send 20010 hello world, I am jackey!
  commands['send'] = function (socket, msg) {
    var spliter = /^(\S+)\s*(.*)$/;
    var match = msg.match(spliter);
    if (typeof match[1] != 'undefined') {
      var uid = match[1];
      var msg = match[2];
      if (isNaN(parseInt(uid))) {
        socket.write('Missed uid.');
      }
      else {
        msg || (msg = '');
        var registered = false;
        clients.forEach(function (client) {
          if (client.uid == uid) {
            client.write('user:'+client.nickname + ' msg:' + msg);
            socket.write('Sent message');
            registered = true;
          }
        });
        if (!registered) socket.write('user with ' + uid + ' not found');
      }
    }
    else {
      throw new Error('Miss uid or msg argment.');
    }
  };

  // Register myself.
  // Syntax: /register uid nick
  // Example: /register 20010 jackey.
  commands['register'] = function (socket, msg) {
    var spliter = /^(\S+)\s*(.*)$/;
    var match = msg.match(spliter);
    if (typeof match[1] != 'undefined') {
      var uid = match[1];
      var nickname = match[2];
      if (isNaN(parseInt(uid))) {
        socket.write('Missed uid.');
      }
      else {
        nickname || (nickname = '');
        var isHere = false;
        for(var i = 0; i < clients.length; i++) {
          if (clients[i].uid == uid) isHere = true;
        }
        if (!isHere) {
          socket.uid = uid;
          socket.nickname = nickname;
          clients.push(socket);
          socket.write('Registe successed.');
        }
        else {
          socket.write('User with ' + uid + ' is be registed.');
        }
      }
    }
    else {
      throw new Error('Miss uid or msg argment.');
    }
  };
  
  // Quit TCP chat server.
  // Syntax: /quit uid
  commands['quit'] = function (socket, msg) {
    var spliter = /^(\S+)\s*(.*)$/;
    var match = msg.match(spliter);
    if (match && typeof match[1] != 'undefined') {
      var uid = match[1];
      if (!isNaN(parseInt(uid))) {
        clients.forEach(function (client) {
          if (client.uid == uid) {
            socket.write('Quit successed.');
            client.destroy();
            delete client;
          }
        });
      }
      else {
        socket.write('Missed uid.');
      }
    }
    
  };
  

  console.log(clients);
  return commands;
}