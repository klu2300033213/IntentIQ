package com.nexora.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "clickstream_events", indexes = {
        @Index(name = "idx_session_id", columnList = "sessionId"),
        @Index(name = "idx_user_id", columnList = "userId"),
        @Index(name = "idx_event_type", columnList = "eventType")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClickstreamEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sessionId;
    private String userId;

    private String eventType; // VIEW, CLICK, ADD_TO_CART, WISHLIST, SEARCH, PURCHASE
    private Long productId;
    private String category;

    @Column(length = 1000)
    private String searchQuery;

    private String inferredIntent; // URGENT_BUY, SEASONAL_LOOK, BARGAIN_HUNT, STYLE_MATCHING

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
