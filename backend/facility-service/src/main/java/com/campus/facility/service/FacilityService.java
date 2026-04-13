package com.campus.facility.service;

import com.campus.facility.dto.FacilityRequestDto;
import com.campus.facility.dto.FacilityResponseDto;

import java.util.List;

public interface FacilityService {

    FacilityResponseDto createFacility(FacilityRequestDto requestDto);

    List<FacilityResponseDto> getAllFacilities();

    FacilityResponseDto getFacilityById(Long id);

    FacilityResponseDto updateFacility(Long id, FacilityRequestDto requestDto);

    void deleteFacility(Long id);
}