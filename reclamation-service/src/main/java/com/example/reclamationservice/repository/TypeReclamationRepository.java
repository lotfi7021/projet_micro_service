package com.example.reclamationservice.repository;

import com.example.reclamationservice.entity.TypeReclamation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TypeReclamationRepository
        extends JpaRepository<TypeReclamation, Long> {

    Optional<TypeReclamation> findByTypeReclamation(String typeReclamation);
}
