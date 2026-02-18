package com.example.microserviceauth.service;

import com.example.microserviceauth.dto.CreateUserRequest;
import com.example.microserviceauth.model.Role;
import com.example.microserviceauth.model.User;
import com.example.microserviceauth.repository.RoleRepository;
import com.example.microserviceauth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    // ================= CREATE =================
    public User create(CreateUserRequest req, Role.RoleName roleName) {

        if (userRepository.existsByUsername(req.username()))
            throw new IllegalStateException("Username déjà utilisé");

        if (userRepository.existsByMail(req.mail()))
            throw new IllegalStateException("Email déjà utilisé");

        if (userRepository.existsByMatriculeUser(req.matriculeUser()))
            throw new IllegalStateException("Matricule déjà utilisé");

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalStateException("Rôle introuvable"));

        User user = new User();
        user.setFirstname(req.firstname());
        user.setLastname(req.lastname());
        user.setUsername(req.username());
        user.setMail(req.mail());
        user.setMatriculeUser(req.matriculeUser());
        user.setTelephone(req.telephone());
        user.setCaisseNumber(req.caisseNumber());
        user.setRole(role);
        user.setDateDebut(LocalDate.now());
        user.setPassword(passwordEncoder.encode(req.password()));

        return userRepository.save(user);
    }

    // ================= UPDATE =================
    public User update(Long id, CreateUserRequest req) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Utilisateur introuvable"));

        if (!user.getUsername().equals(req.username())
                && userRepository.existsByUsername(req.username()))
            throw new IllegalStateException("Username déjà utilisé");

        if (!user.getMail().equals(req.mail())
                && userRepository.existsByMail(req.mail()))
            throw new IllegalStateException("Email déjà utilisé");

        if (!user.getMatriculeUser().equals(req.matriculeUser())
                && userRepository.existsByMatriculeUser(req.matriculeUser()))
            throw new IllegalStateException("Matricule déjà utilisé");

        user.setFirstname(req.firstname());
        user.setLastname(req.lastname());
        user.setUsername(req.username());
        user.setMail(req.mail());
        user.setMatriculeUser(req.matriculeUser());
        user.setTelephone(req.telephone());
        user.setCaisseNumber(req.caisseNumber());

        if (req.password() != null && !req.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.password()));
        }

        return userRepository.save(user);
    }

    // ================= DELETE =================
    public void delete(Long id) {
        if (!userRepository.existsById(id))
            throw new IllegalStateException("Utilisateur introuvable");
        userRepository.deleteById(id);
    }

    // ================= GET =================
    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Utilisateur introuvable"));
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Utilisateur introuvable"));
    }

    public User findByMail(String mail) {
        return userRepository.findByMail(mail)
                .orElseThrow(() -> new IllegalStateException("Utilisateur introuvable"));
    }

    public User findByMatricule(String matricule) {
        return userRepository.findByMatriculeUser(matricule)
                .orElseThrow(() -> new IllegalStateException("Utilisateur introuvable"));
    }

    public List<User> findByRole(Role.RoleName roleName) {
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalStateException("Rôle introuvable"));
        return userRepository.findByRole(role);
    }
}
