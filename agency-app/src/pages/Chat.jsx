import React, { useEffect, useState, useRef } from 'react';
import {
    Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText
} from '@mui/material';

const Chat = ({ username }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ws = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Connect to WebSocket
        ws.current = new WebSocket('ws://localhost:8080/ws/chat');

        ws.current.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.current.onmessage = (event) => {
            const received = JSON.parse(event.data);
            setMessages(prev => [...prev, received]);
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            ws.current?.close();
        };
    }, []);

    const sendMessage = () => {
        if (message.trim() === '') return;

        const chatMessage = {
            sender: username,
            content: message,
            timestamp: new Date().toISOString()
        };

        ws.current.send(JSON.stringify(chatMessage));
        setMessage('');
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Paper sx={{ p: 2, mt: 4, borderRadius: 2 }} elevation={3}>
            <Typography variant="h6" gutterBottom>Chat with Admin</Typography>
            <Box sx={{ height: 300, overflowY: 'auto', mb: 2, border: '1px solid #ddd', p: 1, borderRadius: 1 }}>
                <List>
                    {messages.map((msg, index) => (
                        <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
                            <ListItemText
                                primary={`${msg.sender} (${new Date(msg.timestamp).toLocaleTimeString()}):`}
                                secondary={msg.content}
                            />
                        </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                </List>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button variant="contained" onClick={sendMessage}>Send</Button>
            </Box>
        </Paper>
    );
};

export default Chat;
