package com.campus.facility.repository;

import com.campus.facility.entity.Facility;
import com.campus.facility.enums.FacilityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {

    // filter by type + capacity + location
    List<Facility> findByTypeAndCapacityGreaterThanEqualAndLocationContainingIgnoreCase(
            FacilityType type,
            Integer capacity,
            String location
    );

    // filter by type only
    List<Facility> findByType(FacilityType type);

    // filter by capacity only
    List<Facility> findByCapacityGreaterThanEqual(Integer capacity);

    // filter by location only
    List<Facility> findByLocationContainingIgnoreCase(String location);
}