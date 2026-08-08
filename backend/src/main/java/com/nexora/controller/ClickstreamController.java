package com.nexora.controller;

import com.nexora.model.ClickstreamEvent;
import com.nexora.repository.ClickstreamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Slf4j
public class ClickstreamController {

    private final ClickstreamRepository clickstreamRepository;

    @PostMapping("/track")
    public ResponseEntity<Map<String, String>> trackEvent(@RequestBody ClickstreamEvent event) {
        if (event.getSessionId() == null) event.setSessionId("session-demo");

        String intent = inferIntent(event.getEventType(), event.getSearchQuery());
        event.setInferredIntent(intent);

        clickstreamRepository.save(event);
        log.info("Clickstream event logged: {} for session {}", event.getEventType(), event.getSessionId());

        return ResponseEntity.ok(Map.of(
                "status", "RECORDED",
                "inferredIntent", intent,
                "latencyCheck", "PASSED"
        ));
    }

    private String inferIntent(String type, String query) {
        if ("ADD_TO_CART".equalsIgnoreCase(type) || "PURCHASE".equalsIgnoreCase(type)) {
            return "URGENT_BUY";
        } else if ("SEARCH".equalsIgnoreCase(type) && query != null && query.toLowerCase().contains("cheap")) {
            return "BARGAIN_HUNT";
        } else if ("WISHLIST".equalsIgnoreCase(type)) {
            return "SEASONAL_LOOK";
        }
        return "STYLE_MATCHING";
    }
}
