package com.academia.spazio.service;

import com.academia.spazio.model.Role;
import com.academia.spazio.model.User;
import com.academia.spazio.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LeadService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public LeadService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createLead(String name, String email, String phone) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email já está em uso.");
        }
        User newLead = new User();
        newLead.setName(name);
        newLead.setEmail(email);
        newLead.setPhone(phone);
        newLead.setPassword(passwordEncoder.encode("changeMe123"));
        newLead.setRole(Role.USER);
        return userRepository.save(newLead);
    }
}