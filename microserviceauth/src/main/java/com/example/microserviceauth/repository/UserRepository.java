package com.example.microserviceauth.repository;

import com.example.microserviceauth.model.Role;
import com.example.microserviceauth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    Optional<User> findByMatriculeUser(String matriculeUser);
    Optional<User> findByMail(String mail);

    List<User> findByRole(Role role);

    boolean existsByUsername(String username);
    boolean existsByMail(String mail);
    boolean existsByMatriculeUser(String matriculeUser);
}
