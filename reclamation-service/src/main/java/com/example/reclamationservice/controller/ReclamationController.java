package com.example.reclamationservice.controller;

import com.example.reclamationservice.dto.ChangeEtatDTO;
import com.example.reclamationservice.dto.ReclamationRequestDTO;
import com.example.reclamationservice.dto.ReclamationResponseDTO;
import com.example.reclamationservice.service.ReclamationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reclamations")
public class ReclamationController {

    private final ReclamationService service;

    public ReclamationController(ReclamationService service) {
        this.service = service;
    }

    @PostMapping
    public ReclamationResponseDTO create(@RequestBody ReclamationRequestDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<ReclamationResponseDTO> getAll() {
        return service.findAll();
    }

    @GetMapping("/role/{role}")
    public List<ReclamationResponseDTO> getByRole(@PathVariable String role) {
        return service.findByRole(role);
    }

    @GetMapping("/matricule/{matricule}")
    public List<ReclamationResponseDTO> getByMatricule(@PathVariable String matricule) {
        return service.findByMatricule(matricule);
    }

    @PutMapping("/{id}/etat")
    public ReclamationResponseDTO changeEtat(
            @PathVariable Long id,
            @RequestBody ChangeEtatDTO dto) {
        return service.changeEtat(id, dto.getEtat());
    }
}
