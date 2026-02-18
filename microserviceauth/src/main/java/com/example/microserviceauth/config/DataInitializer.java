package com.example.microserviceauth.config;

import com.example.microserviceauth.model.Role;
import com.example.microserviceauth.model.User;
import com.example.microserviceauth.repository.RoleRepository;
import com.example.microserviceauth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initAdmin() {
        return args -> {

            // 🔹 récupérer rôle ADMIN
            Role adminRole = roleRepository
                    .findByName(Role.RoleName.ADMIN)
                    .orElseThrow(() ->
                            new RuntimeException("❌ ROLE ADMIN NOT FOUND")
                    );

            // 🔹 éviter duplication
            if (userRepository.findByMatriculeUser("000").isPresent()) {
                return;
            }

            User admin = new User();
            admin.setUsername("admin");
            admin.setFirstname("admin");
            admin.setLastname("admin");
            admin.setMail("admin@gmail.com");
            admin.setMatriculeUser("000");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setRole(adminRole);
            admin.setDateDebut(LocalDate.now());

            userRepository.save(admin);

            System.out.println("✅ ADMIN créé avec succès");
        };
    }
}
