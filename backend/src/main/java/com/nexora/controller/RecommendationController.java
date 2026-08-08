package com.nexora.controller;

import com.nexora.model.Product;
import com.nexora.service.RecommendationEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationEngineService recommendationEngineService;

    @GetMapping("/home")
    public ResponseEntity<List<Product>> getHomeFeed(
            @RequestParam(defaultValue = "session-demo") String sessionId,
            @RequestParam(defaultValue = "12") int limit) {
        return ResponseEntity.ok(recommendationEngineService.getPersonalizedFeed(sessionId, limit));
    }

    @GetMapping("/frequently-bought-together/{productId}")
    public ResponseEntity<List<Product>> getFrequentlyBoughtTogether(@PathVariable Long productId) {
        return ResponseEntity.ok(recommendationEngineService.getFrequentlyBoughtTogether(productId));
    }

    @GetMapping("/complete-the-look/{productId}")
    public ResponseEntity<Map<String, Object>> getCompleteTheLook(@PathVariable Long productId) {
        return ResponseEntity.ok(recommendationEngineService.getCompleteTheLook(productId));
    }

    @GetMapping("/explain/{productId}")
    public ResponseEntity<Map<String, Object>> getExplainableMatch(@PathVariable Long productId) {
        return ResponseEntity.ok(recommendationEngineService.getExplainableMatch(productId));
    }
}
