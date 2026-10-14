package com.orderpipeline.notification;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationListener {

    @KafkaListener(topics = "order-created", groupId = "notification-group")
    public void handleOrderCreated(String event) {
        System.out.println("=========================================");
        System.out.println("[NOTIFICATION SERVICE] New Order Event Received: " + event);
        System.out.println("Notification sent to Customer successfully!");
        System.out.println("=========================================");
    }

    @KafkaListener(topics = "order-status-updated", groupId = "notification-group")
    public void handleOrderStatusUpdated(String event) {
        System.out.println("=========================================");
        System.out.println("[NOTIFICATION SERVICE] Order Status Update Received: " + event);
        System.out.println("Notification sent: Status changed successfully!");
        System.out.println("=========================================");
    }
}