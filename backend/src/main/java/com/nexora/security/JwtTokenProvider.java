package com.nexora.security;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@Component
public class JwtTokenProvider {

    private static final String SECRET = "NexoraDiscoveryEngineSecretKeyForTrack7Personalization2026";
    private static final long EXPIRATION_TIME_MS = 86400000L; // 24 hours

    public String generateToken(String email, Long userId) {
        long now = System.currentTimeMillis();
        long exp = now + EXPIRATION_TIME_MS;
        String header = Base64.getUrlEncoder().encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));
        String payload = Base64.getUrlEncoder().encodeToString(
                String.format("{\"sub\":\"%s\",\"id\":%d,\"iat\":%d,\"exp\":%d}", email, userId, now / 1000, exp / 1000)
                        .getBytes(StandardCharsets.UTF_8)
        );
        String signature = hash(header + "." + payload + "." + SECRET);
        return header + "." + payload + "." + signature;
    }

    public boolean validateToken(String token) {
        if (token == null || !token.contains(".")) return false;
        String[] parts = token.split("\\.");
        if (parts.length != 3) return false;
        String signature = hash(parts[0] + "." + parts[1] + "." + SECRET);
        return signature.equals(parts[2]);
    }

    private String hash(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (Exception e) {
            return "signature_err";
        }
    }
}
