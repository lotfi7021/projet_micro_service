package com.example.microserviceauth.controller;

import com.example.microserviceauth.dto.LoginRequest;
import com.example.microserviceauth.dto.LoginResponse;
import com.example.microserviceauth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        return authService.login(
                request.username(),
                request.password()
        );
    }
}

