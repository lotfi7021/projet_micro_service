package com.example.microserviceauth.repository;

import com.example.microserviceauth.model.Role;
import com.example.microserviceauth.model.Role.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
