package com.example.reclamationservice.config;

import com.example.reclamationservice.entity.TypeReclamation;
import com.example.reclamationservice.repository.TypeReclamationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initTypes(TypeReclamationRepository repo) {
        return args -> {

            List<String> types = List.of(
                    "NOTIFICATION",
                    "MANQUE_STOCK",
                    "PROBLEM_SERVER"
            );

            for (String type : types) {
                repo.findByTypeReclamation(type)
                        .orElseGet(() -> {
                            TypeReclamation tr = new TypeReclamation();
                            tr.setTypeReclamation(type);
                            return repo.save(tr);
                        });
            }

            System.out.println("✅ Types de réclamation initialisés");
        };
    }
}
