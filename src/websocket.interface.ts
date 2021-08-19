export interface IWebSocket {
    onConnection: () => void;
    onMessage: () => void;
    onError: () => void;
    onClose: () => void;
    initWebSocket: () => void;
}