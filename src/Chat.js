import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client'
import { Message } from './Message'

const socket = io(process.env.REACT_APP_API_URL, {
    path: process.env.REACT_APP_SOCKET_PATH
})

export const Chat = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const handleConnect = () => {
            setIsConnected(true);
        };

        const handleDisconnect = () => {
            setIsConnected(false);
        };

        const handleJoin = (data) => {
            setMessages((prevMessages) => [...prevMessages, { ...data, type: 'join' }]);
        };

        const handleChat = (data) => {
            if (data.type !== 'join') {
                setMessages((prevMessages) => [...prevMessages, { ...data, type: 'chat' }]);
              }
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('join', handleJoin);
        socket.on('chat',handleChat);

        // Clean up the event listeners when the component unmounts
        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('join', handleJoin);
            socket.off('chat', handleChat);
            
        };
    }, []);

    return (
        <>
            <h2>status: {isConnected ? 'connected' : 'not connected'}</h2>
            <div
                style={{
                    height: '500px',
                    overflowY: 'scroll',
                    border: 'solid black 1px',
                    padding: '10px',
                    marginTop: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {messages.map((message, index) => (
                    <Message message={message} key={index} />
                ))}
            </div>
            <input
        type={'text'}
        id='message'
        onChange={(event) => {
          const value = event.target.value.trim();
          setMessage(value);
        }}
      ></input>
      <button
        onClick={() => {
          if (message && message.length) {
            socket.emit('chat', message);
          }
          var messageBox = document.getElementById('message');
          messageBox.value = '';
          setMessage('');
        }}
      >
        Send
      </button>
        </>
    );
};

