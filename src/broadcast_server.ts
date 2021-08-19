import WebSocket, { Server } from 'ws';

const map = new Map<string, any>();

const wss = new Server({ port: 8081 });

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

wss.on('connection', (ws, req) => { // req.headers
    ws.on('message', data => {
        console.log(`Join: '${data}'`);

        (ws as any).id = data; // typeof Buffer

        //ws.send(`Processing: '${data}'`);
        broadcast(`Join: ${data}`)
    });

    ws.on('close', (code: number, reason: string) => {
        const leftUserId: Buffer = (ws as any).id
        broadcast(`Left: ${leftUserId}`)
    })
});

console.log(`Listen for incoming requests on port 8081...`)