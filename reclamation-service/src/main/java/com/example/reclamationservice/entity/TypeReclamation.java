package com.example.reclamationservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "type_reclamation")
public class TypeReclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String typeReclamation;

    public Long getId() {
        return id;
    }

    public String getTypeReclamation() {
        return typeReclamation;
    }

    public void setTypeReclamation(String typeReclamation) {
        this.typeReclamation = typeReclamation;
    }
}