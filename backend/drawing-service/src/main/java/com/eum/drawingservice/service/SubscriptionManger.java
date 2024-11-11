package com.eum.drawingservice.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SubscriptionManger {

    private final Map<String, Set<String>> sessionSubscriptions = new ConcurrentHashMap<>();

    public void subscribe(String sessionId, String lessonId, String studentId) {
        String subscriptionKey = getSubscriptionKey(lessonId, studentId);
        sessionSubscriptions.computeIfAbsent(sessionId, k -> ConcurrentHashMap.newKeySet())
                .add(subscriptionKey);
    }

    public void unsubscribe(String sessionId, String lessonId, String studentId) {
        String subscriptionKey = getSubscriptionKey(lessonId, studentId);
        Set<String> subscriptions = sessionSubscriptions.get(sessionId);
        if (subscriptions != null) {
            subscriptions.remove(subscriptionKey);
            if (subscriptions.isEmpty()) {
                sessionSubscriptions.remove(sessionId);
            }
        }
    }

    public boolean isSubscribed(String sessionId, String lessonId, String studentId) {
        String subscriptionKey = getSubscriptionKey(lessonId, studentId);
        Set<String> subscriptions = sessionSubscriptions.get(sessionId);
        return subscriptions != null && subscriptions.contains(subscriptionKey);
    }

    public void removeAllSubscriptions(String sessionId) {
        sessionSubscriptions.remove(sessionId);
    }

    private String getSubscriptionKey(String lessonId, String studentId) {
        return lessonId + ":" + studentId;
    }
}
