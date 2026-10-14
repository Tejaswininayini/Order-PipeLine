package com.orderpipeline.order;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5174") 
public class OrderController {

    private final OrderRepository repo;
    private final KafkaTemplate<String, String> kafka;

    public OrderController(OrderRepository repo, KafkaTemplate<String, String> kafka) {
        this.repo = repo;
        this.kafka = kafka;
    }

    @PostMapping
    public Order create(@RequestBody Order order) {
        order.setStatus("CREATED");
        Order saved = repo.save(order);
        String event = String.format(
            "{\"orderId\":%d,\"productName\":\"%s\",\"quantity\":%d,\"amount\":%s}",
            saved.getId(), saved.getProductName(), saved.getQuantity(), saved.getAmount());
        kafka.send("order-created", String.valueOf(saved.getId()), event);
        return saved;
    }

    @GetMapping
    public List<Order> all() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Order one(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }
    @PutMapping("/{id}/status")
    public Order updateStatus(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            @RequestParam(required = false) String status) {

        String newStatus = status;
        if (newStatus == null && body != null) {
            newStatus = body.get("status");
        }

        Order order = repo.findById(id).orElseThrow();
        order.setStatus(newStatus);
        Order saved = repo.save(order);

        // Notify downstream services via Kafka
        String event = String.format("{\"orderId\":%d,\"status\":\"%s\"}", saved.getId(), saved.getStatus());
        kafka.send("order-status-updated", String.valueOf(saved.getId()), event);

        return saved;
    }
}


