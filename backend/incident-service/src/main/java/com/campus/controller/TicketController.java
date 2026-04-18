package com.campus.controller;

import com.campus.dto.*;
import com.campus.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

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
}
