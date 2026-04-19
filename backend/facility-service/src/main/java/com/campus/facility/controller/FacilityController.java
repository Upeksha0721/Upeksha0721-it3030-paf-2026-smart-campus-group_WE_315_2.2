package com.campus.facility.controller;

import com.campus.facility.dto.FacilityRequestDto;
import com.campus.facility.dto.FacilityResponseDto;
import com.campus.facility.entity.Facility;
import com.campus.facility.enums.FacilityStatus;
import com.campus.facility.enums.FacilityType;
import com.campus.facility.repository.FacilityRepository;
import com.campus.facility.service.FacilityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "*")
public class FacilityController {

    private final FacilityService facilityService;
    private final FacilityRepository facilityRepository;

    public FacilityController(FacilityService facilityService,
                              FacilityRepository facilityRepository) {
        this.facilityService = facilityService;
        this.facilityRepository = facilityRepository;
    }

    // =========================
    // CREATE FACILITY
    // =========================
    @PostMapping
    public ResponseEntity<FacilityResponseDto> createFacility(
            @Valid @RequestBody FacilityRequestDto requestDto
    ) {
        FacilityResponseDto createdFacility = facilityService.createFacility(requestDto);
        return new ResponseEntity<>(createdFacility, HttpStatus.CREATED);
    }

    // =========================
    // GET ALL FACILITIES
    // =========================
    @GetMapping
    public ResponseEntity<List<FacilityResponseDto>> getAllFacilities() {
        List<FacilityResponseDto> facilities = facilityService.getAllFacilities();
        return ResponseEntity.ok(facilities);
    }

    // =========================
    // GET FACILITY STATS
    // =========================
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getFacilityStats() {
        List<Facility> facilities = facilityRepository.findAll();

        long total = facilities.size();
        long available = facilities.stream()
                .filter(facility -> facility.getStatus() == FacilityStatus.ACTIVE)
                .count();
        long maintenance = facilities.stream()
                .filter(facility -> facility.getStatus() == FacilityStatus.OUT_OF_SERVICE)
                .count();

        return ResponseEntity.ok(Map.of(
                "total", total,
                "available", available,
                "maintenance", maintenance,
                "bookedToday", 0L
        ));
    }

    // =========================
    // GET FACILITY BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<FacilityResponseDto> getFacilityById(@PathVariable("id") Long id) {
        FacilityResponseDto facility = facilityService.getFacilityById(id);
        return ResponseEntity.ok(facility);
    }

    // =========================
    // UPDATE FACILITY
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<FacilityResponseDto> updateFacility(
            @PathVariable("id") Long id,
            @Valid @RequestBody FacilityRequestDto requestDto
    ) {
        FacilityResponseDto updatedFacility = facilityService.updateFacility(id, requestDto);
        return ResponseEntity.ok(updatedFacility);
    }

    // =========================
    // DELETE FACILITY
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFacility(@PathVariable("id") Long id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.ok("Facility deleted successfully");
    }

    // =========================
    // SEARCH & FILTER
    // =========================
    @GetMapping("/search")
    public ResponseEntity<List<FacilityResponseDto>> searchFacilities(
            @RequestParam(value = "type", required = false) FacilityType type,
            @RequestParam(value = "minCapacity", required = false) Integer minCapacity,
            @RequestParam(value = "location", required = false) String location
    ) {
        List<FacilityResponseDto> response =
                facilityService.searchFacilities(type, minCapacity, location);

        return ResponseEntity.ok(response);
    }
}