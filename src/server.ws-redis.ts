import WebSocket from 'ws'
import express, { Request, Response, NextFunction } from 'express'
import { createServer } from 'http'
import Redis from 'ioredis';

const SERVER_PORT = 4500;
const WS_CHANNEL = 'ws-messages';

let wss: WebSocket.Server;
let publisher: any;
let subscriber: any;

const mockedUsers = [
  {
    id: 1,
    firstname: "John",
    lastname: "Doe"
  }
];

const getHandler = (req: Request, res: Response) => {
  publisher.publish(WS_CHANNEL, JSON.stringify(mockedUsers));

  res.status(200).send('Users list coming soon...')
}

const bootstrap = () => {
  // express init
  const app = express();

  // redis init
  publisher = new Redis();
  subscriber = new Redis();

  subscriber.subscribe(WS_CHANNEL);
  subscriber.on("message", (channel: any, message: any) => {
    if (channel === WS_CHANNEL) {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  });

  //
  // Serve static files from the 'public' folder.
  //
  app.use(express.static('public'));
  /*
  app.get('*', (req: Request, res: Response) => {
      res.sendFile('index_broadcast.html', {root: 'public'});
  });
  */

  //
  // routes
  //
  app.get('/users', getHandler);

  //
  // Create an HTTP server
  //
  const server = createServer(app);

  //
  // Create a WebSocket server completely detached from the HTTP server.
  //
  wss = new WebSocket.Server({ noServer: true });

  server.on('upgrade', (request, socket: any, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
      });
  });

  wss.on('connection', (ws: WebSocket, req: any) => { // req.headers
    let wsId: string;

    ws.on("message", (msg: any) => {
      const message = JSON.parse(msg);
      wsId = message.payload;

      console.log(`message.type: ${message.type}`)
  
      if (message.type === "get-users") {
        ws.send(JSON.stringify(mockedUsers));
      }
  
      if (message.type === "broadcast") {
        publisher.publish(WS_CHANNEL, JSON.stringify(mockedUsers));
      }
    });

    ws.on('close', (code: number, reason: string) => {
        console.log(`Left: ${wsId}`)
        /*
        //broadcastExclude(ws, `Left: ${leftUserId}`)
        const msg = JSON.stringify({ type: 'chat', message: `Left: ${leftUserId}` })
        broadcastExclude(ws, msg)
        */
    })
  });

  //
  // start server
  //
  server.listen(SERVER_PORT, () => {
      console.log(`[bootstrap] HTTP server listen at port ${SERVER_PORT}...`)
  })
}

bootstrap()


