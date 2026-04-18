package com.campus.auth.controller;

import com.campus.auth.dto.UserDTO;
import com.campus.auth.model.User;
import com.campus.auth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")   // adjust if your frontend is on a different port
public class UserController {

    @Autowired
    private UserService userService;

    // GET /api/users  — list all users
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // GET /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // GET /api/users/email/{email}
    @GetMapping("/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    // POST /api/users  — create user
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO dto) {
        return ResponseEntity.ok(userService.createUser(dto));
    }

    // PUT /api/users/{id}  — update name / email / password / role
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id,
                                              @RequestBody UserDTO dto) {
        return ResponseEntity.ok(userService.updateUser(id, dto));
    }

    // PATCH /api/users/{id}/role  — change role only
    // Body: { "role": "STAFF" }
    @PatchMapping("/{id}/role")
    public ResponseEntity<UserDTO> updateRole(@PathVariable Long id,
                                              @RequestBody Map<String, String> body) {
        User.Role role = User.Role.valueOf(body.get("role"));
        return ResponseEntity.ok(userService.updateRole(id, role));
    }

    // PATCH /api/users/{id}/toggle  — activate / deactivate
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<UserDTO> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleActive(id));
    }

    // DELETE /api/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/users/stats  — used by Reports page
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(userService.getUserStats());
    }
}