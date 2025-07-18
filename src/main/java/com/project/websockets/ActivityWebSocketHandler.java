package com.project.websockets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class ActivityWebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private ActivityNotifier notifier;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        notifier.addSession(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        notifier.removeSession(session);
    }
}
