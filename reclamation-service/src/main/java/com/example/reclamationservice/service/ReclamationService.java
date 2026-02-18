package com.example.reclamationservice.service;

import com.example.reclamationservice.dto.ReclamationRequestDTO;
import com.example.reclamationservice.dto.ReclamationResponseDTO;
import com.example.reclamationservice.entity.Reclamation;
import com.example.reclamationservice.entity.TypeReclamation;
import com.example.reclamationservice.repository.ReclamationRepository;
import com.example.reclamationservice.repository.TypeReclamationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReclamationService {

    private final ReclamationRepository reclamationRepository;
    private final TypeReclamationRepository typeRepo;

    public ReclamationService(ReclamationRepository reclamationRepository,
                              TypeReclamationRepository typeRepo) {
        this.reclamationRepository = reclamationRepository;
        this.typeRepo = typeRepo;
    }

    // CREATE
    public ReclamationResponseDTO create(ReclamationRequestDTO dto) {

        TypeReclamation type = typeRepo.findByTypeReclamation(dto.getTypeReclamation())
                .orElseThrow(() -> new RuntimeException("TypeReclamation introuvable"));

        Reclamation r = new Reclamation();
        r.setNomUser(dto.getNomUser());
        r.setMatricule(dto.getMatricule());
        r.setRole(dto.getRole());
        r.setDescription(dto.getDescription());
        r.setTypeReclamation(type);

        return mapToDTO(reclamationRepository.save(r));
    }

    // GET ALL
    public List<ReclamationResponseDTO> findAll() {
        return reclamationRepository.findAll()
                .stream().map(this::mapToDTO).toList();
    }

    // GET BY ROLE
    public List<ReclamationResponseDTO> findByRole(String role) {
        return reclamationRepository.findByRole(role)
                .stream().map(this::mapToDTO).toList();
    }

    // GET BY MATRICULE
    public List<ReclamationResponseDTO> findByMatricule(String matricule) {
        return reclamationRepository.findByMatricule(matricule)
                .stream().map(this::mapToDTO).toList();
    }

    // CHANGE ETAT
    public ReclamationResponseDTO changeEtat(Long id, String etat) {
        Reclamation r = reclamationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reclamation introuvable"));

        r.setEtat(etat);
        return mapToDTO(reclamationRepository.save(r));
    }

    // Mapper
    private ReclamationResponseDTO mapToDTO(Reclamation r) {
        ReclamationResponseDTO dto = new ReclamationResponseDTO();
        dto.setId(r.getId());
        dto.setNomUser(r.getNomUser());
        dto.setMatricule(r.getMatricule());
        dto.setRole(r.getRole());
        dto.setDescription(r.getDescription());
        dto.setEtat(r.getEtat());
        dto.setDateReclamation(r.getDateReclamation());
        dto.setTypeReclamation(r.getTypeReclamation().getTypeReclamation());
        return dto;
    }
}
