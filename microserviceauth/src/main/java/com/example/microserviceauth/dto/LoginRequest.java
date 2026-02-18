package com.example.microserviceauth.dto;

public record LoginRequest(
        String username,
        String password
) {}
