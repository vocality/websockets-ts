import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid'

let userId = uuidv4();

const ws = new WebSocket('ws://localhost:4500');

ws.on('open', () => {
    console.log(`Connected to ws server ${userId}...`)

    //const msg = { type: 'get-users', payload: userId }
    const msg = { type: 'broadcast', payload: userId }
    ws.send(JSON.stringify(msg))
});

ws.on('message', receivedData => {
  console.log(`Received: ${receivedData}`);
});

/*
setTimeout(() => {
    ws.close()
}, 10000)
*/

