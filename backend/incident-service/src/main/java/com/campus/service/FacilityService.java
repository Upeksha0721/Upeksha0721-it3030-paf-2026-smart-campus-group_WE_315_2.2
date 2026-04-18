package com.campus.service;

import com.campus.model.Facility;
import com.campus.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FacilityService {

    private final FacilityRepository facilityRepository;

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public Facility createFacility(Facility facility) {
        return facilityRepository.save(facility);
    }

    public Facility updateFacility(Long id, Facility updated) {
        Facility existing = facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found"));
        existing.setName(updated.getName());
        existing.setAvailable(updated.isAvailable());
        return facilityRepository.save(existing);
    }

    public void deleteFacility(Long id) {
        facilityRepository.deleteById(id);
    }
}