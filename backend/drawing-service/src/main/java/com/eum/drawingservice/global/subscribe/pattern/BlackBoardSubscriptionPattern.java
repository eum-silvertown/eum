package com.eum.drawingservice.global.subscribe.pattern;

import com.eum.drawingservice.global.subscribe.ChannelName;
import org.springframework.stereotype.Component;

@Component
public class BlackBoardSubscriptionPattern implements SubscriptionPattern {

    private static final String[] TOPIC_PARTS = {"topic", "classroom"};
    private static final ChannelName CHANNEL_NAME = ChannelName.BLACKBOARD;

    @Override
    public boolean matches(String destination) {
        String[] parts = destination.split(DIVIDER);
        return parts.length >= 4
                && parts[1].equals(TOPIC_PARTS[0])
                && parts[2].equals(TOPIC_PARTS[1]);
    }

    @Override
    public ChannelName getChannel(String destination) {
        return CHANNEL_NAME;
    }

    @Override
    public String getSubscriptionKey(String destination) {
        String[] parts = destination.split(DIVIDER);
        return parts[3]; // classroomId
    }
}
