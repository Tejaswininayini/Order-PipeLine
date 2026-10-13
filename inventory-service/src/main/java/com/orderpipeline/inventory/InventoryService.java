package com.orderpipeline.inventory;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InventoryService {
    private final InventoryRepository repo;

    public InventoryService(InventoryRepository repo) {
        this.repo = repo;
    }

    public Inventory add(Inventory item) {
        return repo.save(item);
    }

    public List<Inventory> getAll() {
        return repo.findAll();
    }

    public Inventory getByProductId(String productId) {
        return repo.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
    }

    public Inventory reduceStock(String productId, int qty) {
        Inventory item = getByProductId(productId);
        if (item.getQuantity() < qty) {
            throw new RuntimeException("Insufficient stock for " + productId);
        }
        item.setQuantity(item.getQuantity() - qty);
        return repo.save(item);
    }
}