package com.example.microserviceauth;

import com.example.microserviceauth.model.Role;
import com.example.microserviceauth.model.Role.RoleName;
import com.example.microserviceauth.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

@SpringBootApplication
public class MicroserviceauthApplication {

    public static void main(String[] args) {
        createDatabaseIfNotExists();
        SpringApplication.run(MicroserviceauthApplication.class, args);
    }

    private static void createDatabaseIfNotExists() {
        try {
            String url = "jdbc:mysql://localhost:3306/?useSSL=false&serverTimezone=UTC";
            try (Connection c = DriverManager.getConnection(url, "root", "");
                 Statement s = c.createStatement()) {
                s.executeUpdate("CREATE DATABASE IF NOT EXISTS auth_db");
                System.out.println("✅ Database auth_db ready");
            }
        } catch (Exception e) {
            System.err.println("❌ DB creation failed: " + e.getMessage());
        }
    }

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            for (RoleName r : RoleName.values()) {
                roleRepository.findByName(r)
                        .orElseGet(() -> roleRepository.save(new Role(null, r)));
            }
        };
    }
}
