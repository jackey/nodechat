// Commands API
module.exports = function (clients) {
  var commands = {};
  
  // Send message to UID.
  // Syntax: /send uid msg
  // Example: /send 20010 hello world, I am jackey!
  commands['send'] = function (socket, msg) {
    var spliter = /^(\S+)\s*(.*)$/;
    var match = msg.match(spliter);
    if (!match) {
        socket.write('missed command');
        return;
    }
    if (typeof match[1] != 'undefined') {
      var uid = match[1];
      var msg = match[2];
      if (isNaN(parseInt(uid))) {
        socket.write('missed uid');
      }
      else {
        msg || (msg = '');
        var registered = false;
        clients.forEach(function (client) {
          if (client.uid == uid) {
              try {
                 client.writeable = true;
                 client.write(msg);
              }
              catch (err) {
                  console.err(err);
              }
			  registered = true;
          }
        });
        if (!registered) socket.write('user with ' + uid + ' not found');
      }
    }
    else {
      throw new Error('miss uid or msg argument');
    }
  };

  // Register myself.
  // Syntax: /register uid nick
  // Example: /register 20010 jackey.
  commands['register'] = function (socket, msg) {
    var spliter = /^(\S+)\s*(.*)$/;
    var match = msg.match(spliter);
    if (!match) {
        socket.write('missed command');
        return;
    }
    if (typeof match[1] != 'undefined') {
      var uid = match[1];
      var nickname = match[2];
      if (isNaN(parseInt(uid))) {
        socket.write('missed uid');
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
        }
        else {
          socket.write('user ' + uid + ' is already registered');
        }
      }
    }
    else {
      throw new Error('miss uid or msg argment');
    }
  };
  
  // Quit TCP chat server.
  // Syntax: /quit uid
  commands['quit'] = function (socket, msg) {
    var spliter = /^(\S+)\s*(.*)$/;
    var match = msg.match(spliter);
    if (!match) {
        socket.write('missed command');
        return;
    }
    if (match && typeof match[1] != 'undefined') {
      var uid = match[1];
      if (!isNaN(parseInt(uid))) {
        clients.forEach(function (client, index) {
          if (client.uid == uid) {
            socket.write('quit successed');
            client.destroy();
            delete clients[index];
          }
        });
      }
      else {
        socket.write('missed uid');
      }
    }
    
  };
  
  // Status of client.
  // For now available status are [writing, writed]
  // Note: status is from sender.
  // ex, /status uid writing
  commands['status'] = function (socket, msg) {
      var spliter = /^(\S+)\s*(.*)$/;
      var match = msg.match(spliter);
      if (!match) {
          socket.write('missed command');
          return;
      }
      var uid = match[1];
      var status = match[2];
      // Check params.
      if (!uid || typeof uid == 'undefined' || isNaN(parseInt(uid))) {
          socket.write('missed uid');
          return;
      }
      if (!status || typeof status == 'undefined') {
          socket.write('missed status');
          return;
      }
      clients.forEach(function (client) {
          if (client.uid == uid) {
              // Here we go.
              // Just send status to client.
              client.write(status);
          }
      });
  }
  return commands;
}