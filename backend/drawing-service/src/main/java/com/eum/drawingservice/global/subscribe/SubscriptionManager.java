package com.eum.drawingservice.global.subscribe;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SubscriptionManager {

    /*
    Key : channel
    value : {
        Key : subscriptionKey
        value : sessionId
    }
     */
    private final Map<ChannelName, Map<String, Set<String>>> channelSubscriptions = new ConcurrentHashMap<>();

    public void subscribe(ChannelName channel, String subscriptionKey, String sessionId) {
        channelSubscriptions.computeIfAbsent(channel, k -> new ConcurrentHashMap<>())
                .computeIfAbsent(subscriptionKey, k -> ConcurrentHashMap.newKeySet())
                .add(sessionId);
    }

    public void unsubscribe(ChannelName channel, String subscriptionKey, String sessionId) {
        Map<String, Set<String>> keySubscription = channelSubscriptions.get(channel);
        if (keySubscription != null) {
            Set<String> sessionIds = keySubscription.get(subscriptionKey);
            if (sessionIds != null) {
                sessionIds.remove(sessionId);
                if (sessionIds.isEmpty()) {
                    keySubscription.remove(subscriptionKey);
                }
            }
            if (keySubscription.isEmpty()) {
                channelSubscriptions.remove(channel);
            }
        }
    }

    public boolean isSubscribed(ChannelName channel, String subscriptionKey, String sessionId) {
        return channelSubscriptions.getOrDefault(channel, Collections.emptyMap())
                .getOrDefault(subscriptionKey, Collections.emptySet())
                .contains(sessionId);
    }

    public Set<String> getSubscribedSessions(ChannelName channel, String subscriptionKey) {
        return channelSubscriptions.getOrDefault(channel, Collections.emptyMap())
                .getOrDefault(subscriptionKey, Collections.emptySet());
    }

    public Map<String, Set<String>> getChannelSubscriptions(ChannelName channel) {
        return channelSubscriptions.getOrDefault(channel, Collections.emptyMap());
    }

    public void removeAllSubscriptions(String sessionId) {
        channelSubscriptions.values().forEach(keySubscription -> {
            keySubscription.values().forEach(sessionIds -> sessionIds.remove(sessionId));
            keySubscription.values().removeIf(Set::isEmpty);
        });
        channelSubscriptions.values().removeIf(Map::isEmpty);
    }
}