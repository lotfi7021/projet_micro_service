package com.example.reclamationservice.repository;

import com.example.reclamationservice.entity.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {

    List<Reclamation> findByNomUser(String nomUser);

    List<Reclamation> findByRole(String role);

    List<Reclamation> findByMatricule(String matricule);
}
