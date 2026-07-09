package com.generadorpublicidad.common;

import com.generadorpublicidad.auth.model.User;
import com.generadorpublicidad.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Ya existen usuarios en la BD, se omite seeding");
            return;
        }

        var user = User.builder()
                .name("Admin")
                .email("admin@test.com")
                .password(passwordEncoder.encode("password123"))
                .role(User.Role.ADMIN)
                .build();

        userRepository.save(user);
        log.info("Usuario de prueba creado: admin@test.com / password123");
    }
}
