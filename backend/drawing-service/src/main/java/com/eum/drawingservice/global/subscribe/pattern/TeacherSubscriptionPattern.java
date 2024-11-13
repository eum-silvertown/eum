package com.eum.drawingservice.global.subscribe.pattern;

import com.eum.drawingservice.global.subscribe.ChannelName;
import org.springframework.stereotype.Component;

@Component
public class TeacherSubscriptionPattern implements SubscriptionPattern {

    private static final String[] TOPIC_PARTS = {"topic", "teacher", "lesson", "member"};
    private static final ChannelName CHANNEL_NAME = ChannelName.TEACHER_LESSON_MEMBER;

    @Override
    public boolean matches(String destination) {
        String[] parts = destination.split(DIVIDER);
        return parts.length >= 7
                && parts[1].equals(TOPIC_PARTS[0])
                && parts[2].equals(TOPIC_PARTS[1])
                && parts[3].equals(TOPIC_PARTS[2])
                && parts[5].equals(TOPIC_PARTS[3]);
    }

    @Override
    public ChannelName getChannel(String destination) {
        return CHANNEL_NAME;
    }

    @Override
    public String getSubscriptionKey(String destination) {
        String[] parts = destination.split(DIVIDER);
        String lessonId = parts[4];
        String memberId = parts[6];
        return lessonId + ":" + memberId;
    }
}
