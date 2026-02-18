package com.example.microserviceauth.dto;

import java.time.LocalDate;

public record UserDto(
        Long id,
        String firstname,
        String lastname,
        String username,
        String mail,
        String matriculeUser,
        String role,
        LocalDate dateDebut
) {}
