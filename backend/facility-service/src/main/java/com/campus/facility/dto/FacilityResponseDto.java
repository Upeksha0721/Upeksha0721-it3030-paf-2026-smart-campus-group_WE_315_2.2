package com.campus.facility.dto;

import com.campus.facility.enums.FacilityStatus;
import com.campus.facility.enums.FacilityType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@Builder
public class FacilityResponseDto {

    private Long id;
    private String name;
    private FacilityType type;
    private Integer capacity;
    private String location;
    private LocalTime availabilityStart;
    private LocalTime availabilityEnd;
    private FacilityStatus status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}