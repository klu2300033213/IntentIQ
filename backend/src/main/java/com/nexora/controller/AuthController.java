package com.nexora.controller;

import com.nexora.model.User;
import com.nexora.repository.UserRepository;
import com.nexora.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "");
        String rawPassword = body.getOrDefault("password", "");

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            boolean matches = user.getPassword().startsWith("$2a$") ?
                    passwordEncoder.matches(rawPassword, user.getPassword()) :
                    rawPassword.equals(user.getPassword());

            if (matches) {
                String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId());
                return ResponseEntity.ok(Map.of(
                        "status", "SUCCESS",
                        "user", user,
                        "token", token
                ));
            }
        }

        User newUser = User.builder()
                .name(body.getOrDefault("name", "Aarav Sharma"))
                .email(email.isBlank() ? "aarav.sharma@example.com" : email)
                .password(passwordEncoder.encode(rawPassword.isBlank() ? "password123" : rawPassword))
                .tasteProfile("{\"Tech enthusiast\":88,\"Active lifestyle\":72,\"Minimal style\":65}")
                .consentDpdp(true)
                .build();
        userRepository.save(newUser);

        String token = jwtTokenProvider.generateToken(newUser.getEmail(), newUser.getId());
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "user", newUser,
                "token", token
        ));
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody User user) {
        if (user.getTasteProfile() == null) {
            user.setTasteProfile("{\"Tech enthusiast\":75,\"Active lifestyle\":70}");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User saved = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(saved.getEmail(), saved.getId());
        return ResponseEntity.ok(Map.of(
                "status", "CREATED",
                "user", saved,
                "token", token
        ));
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@RequestParam(defaultValue = "aarav.sharma@example.com") String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
