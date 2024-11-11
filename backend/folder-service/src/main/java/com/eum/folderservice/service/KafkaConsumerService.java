package com.eum.folderservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KafkaConsumerService {

    private final FolderService folderService;

    @KafkaListener(topics = "signup-topic")
    public void listen(Object memberId, Acknowledgment ack) {
        folderService.createRootFolder(Long.parseLong(String.valueOf(memberId)));
        ack.acknowledge();
    }
}
