
package com.campus.controller;

import com.campus.model.Facility;
import com.campus.service.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class FacilityController {

    private final FacilityService facilityService;

    // GET all — http://localhost:8083/api/facilities
    @GetMapping
    public ResponseEntity<List<Facility>> getAll() {
        return ResponseEntity.ok(facilityService.getAllFacilities());
    }

    // POST create — http://localhost:8083/api/facilities
    @PostMapping
    public ResponseEntity<Facility> create(@RequestBody Facility facility) {
        return ResponseEntity.ok(facilityService.createFacility(facility));
    }

    // PUT update — http://localhost:8083/api/facilities/1
    @PutMapping("/{id}")
    public ResponseEntity<Facility> update(@PathVariable Long id,
                                           @RequestBody Facility facility) {
        return ResponseEntity.ok(facilityService.updateFacility(id, facility));
    }

    // DELETE — http://localhost:8083/api/facilities/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.noContent().build();
    }
}