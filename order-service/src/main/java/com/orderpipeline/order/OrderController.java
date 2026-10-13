package com.orderpipeline.order;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderRepository repo;

    public OrderController(OrderRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Order create(@RequestBody Order order) {
        order.setStatus("CREATED");
        return repo.save(order);
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
public Order updateStatus(@PathVariable Long id,
                          @RequestParam String status) {
    Order order = repo.findById(id).orElseThrow();
    order.setStatus(status);
    return repo.save(order);
}
}