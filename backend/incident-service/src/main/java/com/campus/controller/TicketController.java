package com.campus.controller;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campus.dto.ReportRequestDTO;
import com.campus.dto.StatusUpdateRequest;
import com.campus.dto.TechnicianAssignRequest;
import com.campus.dto.TicketDTO;
import com.campus.dto.TicketRequest;
import com.campus.dto.TicketSummaryDTO;
import com.campus.service.IncidentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final IncidentService incidentService;

    @PostMapping
    public ResponseEntity<TicketDTO> createTicket(
            @RequestBody @Valid TicketRequest ticketRequest,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(incidentService.createTicket(ticketRequest, email));
    }

    @GetMapping
    public ResponseEntity<List<TicketDTO>> getAllTickets(Authentication authentication) {
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst().orElse("ROLE_USER");
        return ResponseEntity.ok(incidentService.getAllTickets(email, role));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDTO> getTicketById(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst().orElse("ROLE_USER");
        return ResponseEntity.ok(incidentService.getTicketById(id, email, role));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TicketDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst().orElse("ROLE_USER");
        return ResponseEntity.ok(incidentService.updateStatus(id, request, email, role));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<TicketDTO> assignTechnician(
            @PathVariable Long id,
            @RequestBody TechnicianAssignRequest request,
            Authentication authentication) {
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst().orElse("ROLE_USER");
        return ResponseEntity.ok(incidentService.assignTechnician(id, request.getTechnicianId(), role));
    }

    @GetMapping("/attachments/{fileName}")
    public ResponseEntity<Resource> getAttachment(@PathVariable String fileName) throws IOException {
        Path path = Paths.get("uploads/incidents").resolve(fileName);
        Resource resource = new UrlResource(path.toUri());

        if (resource.exists() || resource.isReadable()) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<TicketSummaryDTO> getTicketSummary() {
        return ResponseEntity.ok(incidentService.getTicketSummary());
    }

    @PostMapping("/report/download")
    public ResponseEntity<byte[]> downloadReport(@RequestBody(required = false) ReportRequestDTO request) {
        byte[] pdfBytes = incidentService.generateReport(request);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "incident-report.pdf");
        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }
}
