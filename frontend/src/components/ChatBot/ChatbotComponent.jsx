import React, { useState, useEffect } from 'react';
import Hero from "../../UI/Hero";
import Section from "../../layout/Section";

const ChatbotComponent = () => {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Establish WebSocket connection when component mounts
        const ws = new WebSocket('ws://localhost:5000/'); // Update URL/port as needed
        setSocket(ws);

        // WebSocket event handlers
        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            const response = event.data;
            console.log('Received message from WebSocket:', response);
            setChatLog((prevLog) => [...prevLog, { type: 'response', text: response }]);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            // Close WebSocket connection when component unmounts
            if (ws) {
                ws.close();
                console.log('WebSocket connection closed');
            }
        };
    }, []);

    const handleSendMessage = () => {
        // Send message to WebSocket server (Node.js backend)
        if (message.trim() !== '') {
            setChatLog((prevLog) => [...prevLog, { type: 'user', text: message }]);
            setMessage('');

            // Send message to WebSocket server
            if (socket) {
                socket.send(message);
            }
        }
    };

    return (
        <>
            <Hero title="My Complaints" />
            <Section className="flex flex-col gap-6">
                <div class="flex flex-col h-full bg-gray-100 rounded-lg shadow-md overflow-auto">
                    <div class="px-4 py-2 bg-gray-200 text-gray-700 font-bold">
                        Hi! How can I help you today?
                    </div>

                    <div class="flex-grow px-4 py-2 overflow-y-auto">
                        {chatLog.map((item, index) => (
                            <div key={index} className={`flex mb-2 
                ${item.type === 'response'
                                    ? 'justify-start'
                                    : 'justify-end'
                                }`}
                            >
                                <div
                                    className={`message rounded-lg p-2 
                    ${item.type === 'response'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-300 text-black'
                                        }`}
                                >
                                    {item.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div class="flex items-center justify-between p-4 bg-white border-t border-gray-300">
                        <input
                            class="flex-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button
                            class="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            onClick={handleSendMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>

            </Section></>
    );
};

export default ChatbotComponent;
