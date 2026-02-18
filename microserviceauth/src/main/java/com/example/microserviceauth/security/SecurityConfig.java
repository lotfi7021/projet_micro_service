package com.example.microserviceauth.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // ❌ pas de CSRF (API REST)
                .csrf(csrf -> csrf.disable())

                // ✅ toutes les routes sont publiques
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )

                // ❌ pas de login form
                .formLogin(form -> form.disable())

                // ❌ pas de HTTP Basic
                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
