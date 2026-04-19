package com.campus.facility.dto;

import com.campus.facility.enums.FacilityStatus;
import com.campus.facility.enums.FacilityType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacilityResponseDto {

    private Long id;
    private String name;
    private FacilityType type;
    private Integer capacity;
    private String location;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime availabilityStart;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime availabilityEnd;

    private FacilityStatus status;
    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
}