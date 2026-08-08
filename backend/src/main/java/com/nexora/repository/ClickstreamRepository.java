package com.nexora.repository;

import com.nexora.model.ClickstreamEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClickstreamRepository extends JpaRepository<ClickstreamEvent, Long> {
    List<ClickstreamEvent> findBySessionIdOrderByTimestampDesc(String sessionId);
    List<ClickstreamEvent> findByUserIdOrderByTimestampDesc(String userId);
    void deleteBySessionId(String sessionId);
    void deleteByUserId(String userId);
}
