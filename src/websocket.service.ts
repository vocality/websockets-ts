import { Server } from 'ws'

export class WebSocketService {
  constructor(websocket_port: number) {
    this.initWebSocket(websocket_port);
    console.log(`[WebSocketService.constructor()] WebSocketServer started at port ${websocket_port}...`) 
  }

  public sendData(data: any) {

  }

  private onConnection = (ws: any) => {
    console.log(`[WebSocketService.onConnection] Connected to socket...`)
  }
  
  private onMessage = (data: any, wss: Server) => {
    console.log(`[WebSocketService.onMessage] Received data ${data}`)
  
    // broadcast
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }
  
  private onError = (err: any) => console.log(`[WebSocketService.onError] ${err}`)
  
  private onClose = (wss: Server) => {
    console.log('[WebSocketService.onClose] socket closed...')

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.close()
      }
    })
  }

  private initWebSocket(websocket_port: number) {
    const wss = new Server({ port: websocket_port });

    wss.on('connection', ws => {

      this.onConnection(ws);
    
      ws.on('message', data => this.onMessage(data, wss))
      ws.on('error', err => this.onError(err))
      ws.on('close', ws => this.onClose(wss))
    });

  }
}
