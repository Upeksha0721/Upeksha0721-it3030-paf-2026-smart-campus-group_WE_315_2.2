package com.campus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportRequestDTO {
    private String reportType;
    private String startDate; // Formatted as YYYY-MM-DD
    private String endDate;   // Formatted as YYYY-MM-DD
    private String category;
}
