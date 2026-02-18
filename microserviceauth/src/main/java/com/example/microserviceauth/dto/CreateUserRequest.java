package com.example.microserviceauth.dto;

public record CreateUserRequest(
        String firstname,
        String lastname,
        String username,
        String mail,
        String matriculeUser,
        String password,
        String telephone,
        String caisseNumber
) {}