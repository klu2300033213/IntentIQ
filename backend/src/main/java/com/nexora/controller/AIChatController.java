package com.nexora.controller;

import com.nexora.service.LLMRagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIChatController {

    private final LLMRagService llmRagService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> payload) {
        String prompt = payload.getOrDefault("prompt", payload.getOrDefault("message", ""));
        String sessionId = payload.getOrDefault("sessionId", "session-demo");

        if (prompt.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Prompt cannot be empty"));
        }

        return ResponseEntity.ok(llmRagService.processChatQuery(prompt, sessionId));
    }

    @PostMapping("/compare")
    public ResponseEntity<Map<String, Object>> compareProducts(@RequestBody Map<String, List<Long>> payload) {
        List<Long> productIds = payload.get("productIds");
        if (productIds == null || productIds.size() < 2) {
            return ResponseEntity.badRequest().body(Map.of("error", "At least two productIds are required for comparison."));
        }
        return ResponseEntity.ok(llmRagService.compareProducts(productIds));
    }

    @GetMapping("/buying-advice")
    public ResponseEntity<Map<String, Object>> getBuyingAdvice(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double maxBudget) {
        return ResponseEntity.ok(llmRagService.getBuyingAdvice(category, maxBudget));
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(llmRagService.getAnalytics());
    }
}
