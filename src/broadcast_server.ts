import WebSocket, { Server } from 'ws';
import express, { Request, Response, NextFunction } from 'express'
import { createServer } from 'http'

let wss: Server

const broadcastExclude = (ws: any, data: any) => {
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

const broadcast = (data: any) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            try {
                client.send(data)
            } catch(err) {
                console.log(`[broadcast()] ${err}`)
            }
        }
    })
}

const getHandler = (req: Request, res: Response) => {
    const msg = JSON.stringify({ type: 'action', message: `[getHandler()] called...` });
    broadcast(msg);

    res.status(200).send('Users list coming soon...')
}

const bootstrap = () => {
    const app = express();
    const mapConn = new Map();

    //
    // Serve static files from the 'public' folder.
    //
    app.use(express.static('public'));
/*     app.get('*', (req: Request, res: Response) => {
        res.sendFile('index_broadcast.html', {root: 'public'});
    }); */

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
            //broadcast(`Join: ${data}`)
            const msg = JSON.stringify({ type: 'chat', message: `Join: ${data}` })
            broadcast(msg)
        });
    
        ws.on('close', (code: number, reason: string) => {
            const leftUserId: Buffer = (ws as any).id
            console.log(`Left: ${leftUserId}`)
            //broadcastExclude(ws, `Left: ${leftUserId}`)
            const msg = JSON.stringify({ type: 'chat', message: `Left: ${leftUserId}` })
            broadcastExclude(ws, msg)
        })
    });

    //
    // start server
    //
    server.listen(4500, () => {
        console.log(`[bootstrap] HTTP server listen at port 4500...`)
    })
}

bootstrap();
