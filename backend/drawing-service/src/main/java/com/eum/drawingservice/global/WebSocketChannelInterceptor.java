package com.eum.drawingservice.global;

import com.eum.drawingservice.service.SubscriptionManger;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WebSocketChannelInterceptor implements ChannelInterceptor {

    private final SubscriptionManger subscriptionManger;

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

    private void handleSubscribe(String destination, String sessionId) {
        String[] parts = destination.split("/");
        if (parts.length >= 6
                && parts[1].equals("topic")
                && parts[2].equals("teacher")
                && parts[3].equals("lesson")
                && parts[5].equals("member")) {
            String lessonId = parts[4];
            String memberId = parts[6];
            subscriptionManger.subscribe(sessionId, lessonId, memberId);
        }
    }

    private void handleUnsubscribe(String destination, String sessionId) {
        String[] parts = destination.split("/");
        if (parts.length >= 5
                && parts[1].equals("topic")
                && parts[2].equals("teacher")
                && parts[3].equals("lesson")
                && parts[5].equals("member")) {
            String lessonId = parts[4];
            String memberId = parts[6];
            subscriptionManger.unsubscribe(sessionId, lessonId, memberId);
        }
    }

    private void handleDisconnect(String sessionId) {
        subscriptionManger.removeAllSubscriptions(sessionId);
    }
}
