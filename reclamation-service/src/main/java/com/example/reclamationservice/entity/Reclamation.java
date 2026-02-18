package com.example.reclamationservice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reclamation")
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomUser;
    private String matricule;
    private String role;

    @ManyToOne
    @JoinColumn(name = "type_reclamation_id")
    private TypeReclamation typeReclamation;

    private String description;
    private String etat;
    private LocalDateTime dateReclamation;

    @PrePersist
    public void prePersist() {
        this.dateReclamation = LocalDateTime.now();
        this.etat = "NON_VALIDE";
    }

    // ===== GETTERS / SETTERS =====

    public Long getId() {
        return id;
    }

    public String getNomUser() {
        return nomUser;
    }

    public void setNomUser(String nomUser) {
        this.nomUser = nomUser;
    }

    public String getMatricule() {
        return matricule;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public TypeReclamation getTypeReclamation() {
        return typeReclamation;
    }

    public void setTypeReclamation(TypeReclamation typeReclamation) {
        this.typeReclamation = typeReclamation;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEtat() {
        return etat;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }

    public LocalDateTime getDateReclamation() {
        return dateReclamation;
    }
}
