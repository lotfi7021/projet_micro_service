package com.example.microserviceauth.controller;

import com.example.microserviceauth.dto.CreateUserRequest;
import com.example.microserviceauth.dto.UserDto;
import com.example.microserviceauth.model.Role;
import com.example.microserviceauth.model.User;
import com.example.microserviceauth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ================= CREATE =================
    @PostMapping
    public UserDto create(@RequestBody CreateUserRequest request,
                          @RequestParam Role.RoleName role) {

        User saved = userService.create(request, role);
        return toDto(saved);
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public UserDto update(@PathVariable Long id,
                          @RequestBody CreateUserRequest request) {

        return toDto(userService.update(id, request));
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }

    // ================= GET =================
    @GetMapping
    public List<UserDto> all() {
        return userService.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public UserDto byId(@PathVariable Long id) {
        return toDto(userService.findById(id));
    }

    @GetMapping("/username/{username}")
    public UserDto byUsername(@PathVariable String username) {
        return toDto(userService.findByUsername(username));
    }

    @GetMapping("/mail/{mail}")
    public UserDto byMail(@PathVariable String mail) {
        return toDto(userService.findByMail(mail));
    }

    @GetMapping("/matricule/{matricule}")
    public UserDto byMatricule(@PathVariable String matricule) {
        return toDto(userService.findByMatricule(matricule));
    }

    @GetMapping("/role/{role}")
    public List<UserDto> byRole(@PathVariable Role.RoleName role) {
        return userService.findByRole(role)
                .stream()
                .map(this::toDto)
                .toList();
    }

    // ================= MAPPER =================
    private UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getFirstname(),
                user.getLastname(),
                user.getUsername(),
                user.getMail(),
                user.getMatriculeUser(),
                user.getRole().getName().name(),
                user.getDateDebut()
        );
    }
}
