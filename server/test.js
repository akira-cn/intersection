const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8360 });


wss.on('connection', function connection(ws) {
  function broadcast(message) {
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.token === ws.token &&
          client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    })    
  }

  ws.on('message', function incoming(data) {
    console.log(data)
    const message = JSON.parse(data)
    if(message.type === 'connect'){
      ws.token = message.token
    }
    broadcast(message)
  })
});
