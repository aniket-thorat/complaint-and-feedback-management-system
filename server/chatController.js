const WebSocket = require('ws');
const { spawn } = require('child_process');

const wss = new WebSocket.Server({ server });

const controlChat = () => {
    // WebSocket connection handler
    wss.on('connection', (ws) => {
        console.log('Client connected');

        // Handle messages from the client (React frontend)
        ws.on('message', (message) => {
            console.log('Received message:', message);
            // Send the message to the Python chatbot script
            const chatbotProcess = spawn('python', ['chatbot.py']);

            chatbotProcess.stdout.on('data', (data) => {
                const response = data.toString().trim();
                console.log('Chatbot response:', response);
                ws.send(response); // Send the chatbot response back to the client
            });

            // Pass the message from the client to the chatbot script's stdin
            chatbotProcess.stdin.write(message + '\n');
            chatbotProcess.stdin.end();
        });

        // Handle WebSocket connection closing
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
}

module.exports = {
    controlChat
};