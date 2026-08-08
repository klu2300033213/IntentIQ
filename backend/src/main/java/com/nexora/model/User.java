package com.nexora.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Column(length = 2000)
    private String tasteProfile; // JSON representation of user affinities

    @Builder.Default
    private Boolean consentDpdp = true;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
