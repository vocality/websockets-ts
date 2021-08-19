import WebSocket, { Server } from 'ws';
import express, { Request, Response, NextFunction } from 'express'
import { createServer } from 'http'

let wss: Server

const broadcast = (data: any, ws: any) => {
    wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            try {
                client.send(data)
            } catch(err) {
                console.log(`[broadcast()] ${err}`)
            }
        }
    })
}

const getHandler = (req: Request, res: Response) => {
    // send WS notification
    //curWs.send('notif from getHandler...')

    // broadcast
    //broadcast('User created !')

    res.status(200).send('Users list coming soon...')
}

const bootstrap = () => {
    const app = express();
    const mapConn = new Map();

    //
    // Serve static files from the 'public' folder.
    //
    app.use(express.static('public'));
    app.get('*', (req: Request, res: Response) => {
        res.sendFile('index_broadcast.html', {root: 'public'});
    });

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
    wss = new Server({ noServer: true });

    server.on('upgrade', (request, socket: any, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });

    wss.on('connection', (ws, req) => { // req.headers
        ws.on('message', data => {
            console.log(`Join: '${data}'`);
    
            (ws as any).id = data; // typeof Buffer
    
            //ws.send(`Processing: '${data}'`);
            broadcast(`Join: ${data}`, ws)
        });
    
        ws.on('close', (code: number, reason: string) => {
            const leftUserId: Buffer = (ws as any).id
            console.log(`Left: ${leftUserId}`)
            broadcast(`Left: ${leftUserId}`, ws)
        })
    });

    //
    // start server
    //
    server.listen(4500, () => {
        console.log(`HTTP server listen at port 4500...`)
    })
}

bootstrap();
