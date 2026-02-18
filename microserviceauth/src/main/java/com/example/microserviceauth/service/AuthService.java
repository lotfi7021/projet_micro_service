package com.example.microserviceauth.service;
import com.example.microserviceauth.dto.LoginResponse;

import com.example.microserviceauth.model.User;
import com.example.microserviceauth.repository.UserRepository;
import com.example.microserviceauth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponse login(String username, String password) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Username incorrect"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        String role = user.getRole().getName().name();

        String token = jwtUtil.generateToken(
                user.getUsername(),
                role
        );

        return new LoginResponse(
                token,
                user.getUsername(),
                role
        );
    }
}
