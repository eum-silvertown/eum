package com.eum.drawingservice.global.subscribe.pattern;

import com.eum.drawingservice.global.subscribe.ChannelName;

public interface SubscriptionPattern {

    String DIVIDER = "/";
    
    boolean matches(String destination);

    ChannelName getChannel(String destination);

    String getSubscriptionKey(String destination);
}
