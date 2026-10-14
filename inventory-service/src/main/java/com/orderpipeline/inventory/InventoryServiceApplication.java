package com.orderpipeline.inventory;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class InventoryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner seed(ProductRepository repo) {
        return args -> {
            repo.save(new Product("Laptop", 55000, 10));
            repo.save(new Product("Phone", 20000, 25));
            repo.save(new Product("Headphones", 2500, 50));
        };
    }
}