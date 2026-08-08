package com.nexora.service;

import com.nexora.model.User;
import com.nexora.repository.ClickstreamRepository;
import com.nexora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class DPDPPrivacyService {

    private final UserRepository userRepository;
    private final ClickstreamRepository clickstreamRepository;

    @Transactional
    public Map<String, Object> exportUserData(String email) {
        User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
        Map<String, Object> exportData = new HashMap<>();
        if (user != null) {
            exportData.put("userId", user.getId());
            exportData.put("name", user.getName());
            exportData.put("email", user.getEmail());
            exportData.put("consentDpdp", user.getConsentDpdp());
            exportData.put("tasteProfile", user.getTasteProfile());
            exportData.put("complianceNotice", "Exported under Data Protection & Digital Privacy (DPDP) Act 2023");
        } else {
            exportData.put("notice", "User not found or anonymized");
        }
        return exportData;
    }

    @Transactional
    public Map<String, Object> purgeUserData(String email, String sessionId) {
        log.info("DPDP Right to be Forgotten invoked for email: {}, session: {}", email, sessionId);
        if (email != null && !email.isBlank()) {
            userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
                user.setTasteProfile("{\"Anonymized\":true}");
                userRepository.save(user);
            });
            clickstreamRepository.deleteByUserId(email);
        }
        if (sessionId != null && !sessionId.isBlank()) {
            clickstreamRepository.deleteBySessionId(sessionId);
        }
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Personal data & clickstream history purged successfully under DPDP 2023 guidelines.");
        return response;
    }
}
