package com.eum.drawingservice.global.subscribe;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SubscriptionManager {

    private final Map<String, Map<ChannelName, Set<String>>> sessionSubscriptions = new ConcurrentHashMap<>();

    public void subscribe(String sessionId, ChannelName channel, String subscriptionKey) {
        sessionSubscriptions.computeIfAbsent(sessionId, k -> new ConcurrentHashMap<>())
                .computeIfAbsent(channel, k -> ConcurrentHashMap.newKeySet())
                .add(subscriptionKey);
    }

    public void unsubscribe(String sessionId, ChannelName channel, String subscriptionKey) {
        Map<ChannelName, Set<String>> channelSubscriptions = sessionSubscriptions.get(sessionId);
        if (channelSubscriptions != null) {
            Set<String> subscriptions = channelSubscriptions.get(channel);
            if (subscriptions != null) {
                subscriptions.remove(subscriptionKey);
                if (subscriptions.isEmpty()) {
                    channelSubscriptions.remove(channel);
                }
            }
            if (channelSubscriptions.isEmpty()) {
                sessionSubscriptions.remove(sessionId);
            }
        }
    }

    public boolean isSubscribed(String sessionId, ChannelName channel, String subscriptionKey) {
        return sessionSubscriptions.getOrDefault(sessionId, Collections.emptyMap())
                .getOrDefault(channel, Collections.emptySet())
                .contains(subscriptionKey);
    }

    public void removeAllSubscriptions(String sessionId) {
        sessionSubscriptions.remove(sessionId);
    }
}