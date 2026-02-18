package com.example.reclamationservice.dto;

import java.time.LocalDateTime;

public class ReclamationResponseDTO {

    private Long id;
    private String nomUser;
    private String matricule;
    private String role;
    private String description;
    private String etat;
    private LocalDateTime dateReclamation;
    private String typeReclamation;

    // ===== GETTERS =====

    public Long getId() {
        return id;
    }

    public String getNomUser() {
        return nomUser;
    }

    public String getMatricule() {
        return matricule;
    }

    public String getRole() {
        return role;
    }

    public String getDescription() {
        return description;
    }

    public String getEtat() {
        return etat;
    }

    public LocalDateTime getDateReclamation() {
        return dateReclamation;
    }

    public String getTypeReclamation() {
        return typeReclamation;
    }

    // ===== SETTERS =====

    public void setId(Long id) {
        this.id = id;
    }

    public void setNomUser(String nomUser) {
        this.nomUser = nomUser;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }

    public void setDateReclamation(LocalDateTime dateReclamation) {
        this.dateReclamation = dateReclamation;
    }

    public void setTypeReclamation(String typeReclamation) {
        this.typeReclamation = typeReclamation;
    }
}
