package com.orderpipeline.order;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import java.util.regex.*;

@Component
public class OrderStatusListener {

    private final OrderRepository repo;

    public OrderStatusListener(OrderRepository repo) {
        this.repo = repo;
    }

    @KafkaListener(topics = "payment-result")
    public void onPayment(String message) {
        String status = message.contains("\"status\":\"PAID\"") ? "PAID" : "FAILED";
        update(message, status);
    }

    @KafkaListener(topics = "inventory-result")
    public void onInventory(String message) {
        String status = message.contains("\"status\":\"RESERVED\"") ? "COMPLETED" : "FAILED";
        update(message, status);
    }

    private void update(String message, String status) {
        Matcher m = Pattern.compile("\"orderId\":(\\d+)").matcher(message);
        if (m.find()) {
            Long id = Long.parseLong(m.group(1));
            repo.findById(id).ifPresent(o -> {
                o.setStatus(status);
                repo.save(o);
                System.out.println("Order " + id + " -> " + status);
            });
        }
    }
}
