package com.academia.spazio.controller;

import com.academia.spazio.model.User;
import com.academia.spazio.service.LeadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "http://localhost:5173") // Permitir acesso do frontend
public class PublicController {
    private final LeadService leadService;

    public PublicController(LeadService leadService) {
        this.leadService = leadService;
    }

    @PostMapping("/leads")
    public ResponseEntity<?> createLead(@RequestBody LeadRequest request) {
        try {
            User createdLead = leadService.createLead(request.getName(), request.getEmail(), request.getPhone());
            return new ResponseEntity<>(createdLead, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    // Classe LeadRequest interna
    public static class LeadRequest {
        private String name;
        private String email;
        private String phone;

        // Getters and Setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }
    }
}