package com.orderpipeline.order;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
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
}