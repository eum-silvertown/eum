package com.eum.drawingservice.global;

import com.eum.drawingservice.global.subscribe.ChannelName;
import com.eum.drawingservice.global.subscribe.SubscriptionManager;
import com.eum.drawingservice.global.subscribe.pattern.SubscriptionPattern;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class WebSocketChannelInterceptor implements ChannelInterceptor {

    private final SubscriptionManager subscriptionManager;
    private final List<SubscriptionPattern> subscriptionPatterns;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        StompCommand command = accessor.getCommand();

        String sessionId = accessor.getSessionId();
        String destination = accessor.getDestination();

        if (StompCommand.SUBSCRIBE.equals(command)) {
            handleSubscribe(sessionId, destination);
        } else if (StompCommand.UNSUBSCRIBE.equals(command)) {
            handleUnsubscribe(sessionId, destination);
        } else if (StompCommand.DISCONNECT.equals(command)) {
            handleDisconnect(sessionId);
        }

        return message;
    }

    private void handleSubscribe(String sessionId, String destination) {
        for (SubscriptionPattern pattern : subscriptionPatterns) {
            if (pattern.matches(destination)) {
                ChannelName channel = pattern.getChannel(destination);
                String subscriptionKey = pattern.getSubscriptionKey(destination);
                subscriptionManager.subscribe(sessionId, channel, subscriptionKey);
                break;
            }
        }
    }

    private void handleUnsubscribe(String sessionId, String destination) {
        for (SubscriptionPattern pattern : subscriptionPatterns) {
            if (pattern.matches(destination)) {
                ChannelName channel = pattern.getChannel(destination);
                String subscriptionKey = pattern.getSubscriptionKey(destination);
                subscriptionManager.unsubscribe(sessionId, channel, subscriptionKey);
                break;
            }
        }
    }

    private void handleDisconnect(String sessionId) {
        subscriptionManager.removeAllSubscriptions(sessionId);
    }
}