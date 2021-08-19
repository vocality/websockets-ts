"use strict";

var alertDiv = function (alertType, data) {
    return '<div class="alert ' + alertType + ' alert-dismissible fade show" role="alert">' +
        data +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>';
};
var ws;
try {
    ws = new WebSocket('ws://localhost:4500');
    var userId = uuidv4();
    // Connection opened
    ws.addEventListener('open', function (event) {
        ws.send(userId);
        document.getElementById('status').innerText = 'Status: Connected';
        document.getElementById('user_id').innerText = 'Current ID: ' + userId;
    });
    // Listen for messages
    ws.addEventListener('message', function (event) {
        console.log('[message] Message from server ', event.data);
        // filter received data by 'type': chat, action
        var data = JSON.parse(event.data);
        var alert = document.getElementById('alert');
        switch (data.type) {
            case 'action':
                alert.innerHTML = alertDiv('alert-info', data.message);
                break;
            case 'chat':
                alert.innerHTML = alertDiv('alert-success', data.message);
                break;
        }
    });
}
catch (error) {
    console.log(error);
}
var output = document.getElementById('output');
document.getElementById('btnData').onclick = function () {
    axios.get('http://localhost:4500/users')
        .then(function (res) {
        output.className = 'container';
        output.innerHTML = res.data;
    })["catch"](function (err) {
        output.className = 'container text-danger';
        output.innerHTML = err;
    });
};
document.getElementById('btnDisconnect').onclick = function () {
    ws.close();
    document.getElementById('status').innerText = 'Status: Disconnected';
    document.getElementById('user_id').innerText = '';
    document.getElementById('btnData').disabled = true;
    document.getElementById('btnDisconnect').disabled = true;
    output.innerText = '';
};
