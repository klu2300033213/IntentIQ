package com.nexora.controller;

import com.nexora.service.DPDPPrivacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/privacy/gdpr-dpdp")
@RequiredArgsConstructor
public class DPDPController {

    private final DPDPPrivacyService dpdpPrivacyService;

    @GetMapping("/export")
    public ResponseEntity<Map<String, Object>> exportData(@RequestParam(defaultValue = "aarav.sharma@example.com") String email) {
        return ResponseEntity.ok(dpdpPrivacyService.exportUserData(email));
    }

    @PostMapping("/purge")
    public ResponseEntity<Map<String, Object>> purgeData(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String sessionId = payload.get("sessionId");
        return ResponseEntity.ok(dpdpPrivacyService.purgeUserData(email, sessionId));
    }
}
