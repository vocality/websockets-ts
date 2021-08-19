import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const alertDiv = (alertType: string, data: any) => {
    return '<div class="alert ' + alertType + ' alert-dismissible fade show" role="alert">' +
                data +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span>' +
                '</button>' +
            '</div>'; 
}


let ws: WebSocket;

try {
    ws = new WebSocket('ws://localhost:4500');
    let userId = uuidv4();

    // Connection opened
    ws.addEventListener('open', function (event) {
        ws.send(userId);

        (document.getElementById('status') as HTMLElement).innerText = 'Status: Connected';
        (document.getElementById('user_id') as HTMLElement).innerText = 'Current ID: ' + userId;
    });

    // Listen for messages
    ws.addEventListener('message', function (event) {
        console.log('[message] Message from server ', event.data);

        // filter received data by 'type': chat, action
        const data = JSON.parse(event.data)
        
        let alert: HTMLElement = (document.getElementById('alert') as HTMLElement);

        switch(data.type) {
            case 'action':
                alert.innerHTML = alertDiv('alert-info', data.message)
                break;

            case 'chat':
                alert.innerHTML = alertDiv('alert-success', data.message)
                break;
        }                    
    });
} catch (error) {
    console.log(error);
}

let output: HTMLElement = (document.getElementById('output') as HTMLElement);

(document.getElementById('btnData') as HTMLInputElement).onclick = function () {
    axios.get('http://localhost:4500/users')
        .then(function (res: any) {
            output.className = 'container'
            output.innerHTML = res.data;
        })
        .catch(function (err: any) {
            output.className = 'container text-danger'
            output.innerHTML = err;
        })
};

(document.getElementById('btnDisconnect') as HTMLInputElement).onclick = function () {
    ws.close();

    (document.getElementById('status') as HTMLElement).innerText = 'Status: Disconnected';
    (document.getElementById('user_id') as HTMLElement).innerText = '';
    (document.getElementById('btnData') as HTMLInputElement).disabled = true;
    (document.getElementById('btnDisconnect') as HTMLInputElement).disabled = true;
    output.innerText =  '';
};