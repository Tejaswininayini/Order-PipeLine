package com.orderpipeline.inventory;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    private final InventoryService service;

    public InventoryController(InventoryService service) {
        this.service = service;
    }

    @PostMapping
    public Inventory add(@RequestBody Inventory item) {
        return service.add(item);
    }

    @GetMapping
    public List<Inventory> getAll() {
        return service.getAll();
    }

    @GetMapping("/{productId}")
    public Inventory get(@PathVariable String productId) {
        return service.getByProductId(productId);
    }

    @PutMapping("/{productId}/reduce")
    public Inventory reduce(@PathVariable String productId, @RequestParam int quantity) {
        return service.reduceStock(productId, quantity);
    }
}