package com.nexora.controller;

import com.nexora.model.Product;
import com.nexora.service.LLMRagService;
import com.nexora.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final LLMRagService llmRagService;

    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double maxPrice) {
        if ((q != null && !q.isBlank()) || category != null || maxPrice != null) {
            return ResponseEntity.ok(llmRagService.semanticSearch(q, category, maxPrice));
        }
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
