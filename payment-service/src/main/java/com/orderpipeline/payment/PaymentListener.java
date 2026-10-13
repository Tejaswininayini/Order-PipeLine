package com.orderpipeline.payment;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import java.util.regex.*;

@Component
public class PaymentListener {

    private final KafkaTemplate<String, String> kafka;

    public PaymentListener(KafkaTemplate<String, String> kafka) {
        this.kafka = kafka;
    }

    @KafkaListener(topics = "order-created")
    public void onOrderCreated(String message) {
        System.out.println("Payment received: " + message);
        String orderId = find(message, "\"orderId\":(\\d+)");
        double amount = Double.parseDouble(find(message, "\"amount\":([0-9.]+)"));
        String status = amount > 100000 ? "FAILED" : "PAID";
        String result = message.substring(0, message.length() - 1)
                + ",\"status\":\"" + status + "\"}";
        kafka.send("payment-result", orderId, result);
        System.out.println("Payment result: " + result);
    }

    private String find(String text, String regex) {
        Matcher m = Pattern.compile(regex).matcher(text);
        return m.find() ? m.group(1) : "";
    }
}
