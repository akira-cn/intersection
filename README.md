# intersection.js

Control a remote web page with your tablet or your mobile phone.

## How to use

1. Put the script at the bottom of the page that you want to control.

  ```html
  <script src="https://s4.ssl.qhres.com/!04a297cf/intersection-1.0.0.js" 
    data-isct-server="ws://your.websocket.server" data-isct-token="something"></script>
  ```

2. Open the page on your PC and your mobile phone. Operate on your mobile phone.

## Websocket server

Implement a simple broadcast websocket server.

```js

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
```

## Demo

[DEMO](http://code.weizoo.com/fit)

## License

MIT