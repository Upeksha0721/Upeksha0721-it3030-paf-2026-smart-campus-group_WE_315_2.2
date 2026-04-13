package com.campus.facility.dto;

import com.campus.facility.enums.FacilityStatus;
import com.campus.facility.enums.FacilityType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class FacilityRequestDto {

    @NotBlank(message = "Facility name is required")
    private String name;

    @NotNull(message = "Facility type is required")
    private FacilityType type;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Availability start time is required")
    private LocalTime availabilityStart;

    @NotNull(message = "Availability end time is required")
    private LocalTime availabilityEnd;

    @NotNull(message = "Facility status is required")
    private FacilityStatus status;

    private String description;
}