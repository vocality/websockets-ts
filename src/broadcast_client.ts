import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid'

let userId = uuidv4();

const ws = new WebSocket('ws://localhost:4500');

ws.on('open', () => {
    console.log('Connected to ws server...')
    //ws.send(`New user created ${userId}`);
    ws.send(userId)
});

ws.on('message', receivedData => {
  console.log(`Received: ${receivedData}`);
});

setTimeout(() => {
    ws.close()
}, 20000)

