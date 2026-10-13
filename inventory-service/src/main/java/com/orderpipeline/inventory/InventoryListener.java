package com.orderpipeline.inventory;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.*;

@Component
public class InventoryListener {

    private final KafkaTemplate<String, String> kafka;
    private final Map<String, Integer> stock = new ConcurrentHashMap<>(
            Map.of("Laptop", 10, "Mouse", 50));

    public InventoryListener(KafkaTemplate<String, String> kafka) {
        this.kafka = kafka;
    }

    @KafkaListener(topics = "payment-result")
    public void onPaymentResult(String message) {
        System.out.println("Inventory got: " + message);
        if (!message.contains("\"status\":\"PAID\"")) return;

        String orderId = find(message, "\"orderId\":(\\d+)");
        String product = find(message, "\"productName\":\"([^\"]+)\"");
        int qty = Integer.parseInt(find(message, "\"quantity\":(\\d+)"));

        int available = stock.getOrDefault(product, 0);
        String status;
        if (available >= qty) {
            stock.put(product, available - qty);
            status = "RESERVED";
        } else {
            status = "OUT_OF_STOCK";
        }
        String result = "{\"orderId\":" + orderId + ",\"status\":\"" + status + "\"}";
        kafka.send("inventory-result", orderId, result);
        System.out.println("Inventory result: " + result);
    }

    private String find(String text, String regex) {
        Matcher m = Pattern.compile(regex).matcher(text);
        return m.find() ? m.group(1) : "";
    }
}