package com.eum.drawingservice.global.subscribe;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ChannelName {

    TEACHER_LESSON_MEMBER("teacher-lesson-member"),
    BLACKBOARD("blackboard")
    ;

    private final String channelName;
}
