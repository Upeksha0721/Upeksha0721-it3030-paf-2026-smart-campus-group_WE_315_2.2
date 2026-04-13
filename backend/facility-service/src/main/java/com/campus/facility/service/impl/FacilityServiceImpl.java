package com.campus.facility.service.impl;

import com.campus.facility.dto.FacilityRequestDto;
import com.campus.facility.dto.FacilityResponseDto;
import com.campus.facility.entity.Facility;
import com.campus.facility.repository.FacilityRepository;
import com.campus.facility.service.FacilityService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacilityServiceImpl implements FacilityService {

    private final FacilityRepository facilityRepository;

    public FacilityServiceImpl(FacilityRepository facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    @Override
    public FacilityResponseDto createFacility(FacilityRequestDto requestDto) {
        Facility facility = Facility.builder()
                .name(requestDto.getName())
                .type(requestDto.getType())
                .capacity(requestDto.getCapacity())
                .location(requestDto.getLocation())
                .availabilityStart(requestDto.getAvailabilityStart())
                .availabilityEnd(requestDto.getAvailabilityEnd())
                .status(requestDto.getStatus())
                .description(requestDto.getDescription())
                .build();

        Facility savedFacility = facilityRepository.save(facility);
        return mapToResponse(savedFacility);
    }

    @Override
    public List<FacilityResponseDto> getAllFacilities() {
        return facilityRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FacilityResponseDto getFacilityById(Long id) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));

        return mapToResponse(facility);
    }

    @Override
    public FacilityResponseDto updateFacility(Long id, FacilityRequestDto requestDto) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));

        facility.setName(requestDto.getName());
        facility.setType(requestDto.getType());
        facility.setCapacity(requestDto.getCapacity());
        facility.setLocation(requestDto.getLocation());
        facility.setAvailabilityStart(requestDto.getAvailabilityStart());
        facility.setAvailabilityEnd(requestDto.getAvailabilityEnd());
        facility.setStatus(requestDto.getStatus());
        facility.setDescription(requestDto.getDescription());

        Facility updatedFacility = facilityRepository.save(facility);
        return mapToResponse(updatedFacility);
    }

    @Override
    public void deleteFacility(Long id) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found with id: " + id));

        facilityRepository.delete(facility);
    }

    private FacilityResponseDto mapToResponse(Facility facility) {
        return FacilityResponseDto.builder()
                .id(facility.getId())
                .name(facility.getName())
                .type(facility.getType())
                .capacity(facility.getCapacity())
                .location(facility.getLocation())
                .availabilityStart(facility.getAvailabilityStart())
                .availabilityEnd(facility.getAvailabilityEnd())
                .status(facility.getStatus())
                .description(facility.getDescription())
                .createdAt(facility.getCreatedAt())
                .updatedAt(facility.getUpdatedAt())
                .build();
    }
}