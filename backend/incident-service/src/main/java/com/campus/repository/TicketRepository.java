package com.campus.repository;

import com.campus.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUserId(String userId);
    List<Ticket> findByAssignedTechnicianId(String technicianId);
    
    long countByStatus(com.campus.model.TicketStatus status);
    
    long countByStatusAndCreatedAtBetween(com.campus.model.TicketStatus status, java.time.LocalDateTime start, java.time.LocalDateTime end);
    
    java.util.List<Ticket> findByCreatedAtBetweenOrderByCreatedAtDesc(java.time.LocalDateTime start, java.time.LocalDateTime end);
}
