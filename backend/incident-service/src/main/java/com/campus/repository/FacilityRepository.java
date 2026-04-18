package com.campus.repository;

import com.campus.model.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FacilityRepository extends JpaRepository<Facility, Long> {
    List<Facility> findByAvailableTrue();  // Custom query
}