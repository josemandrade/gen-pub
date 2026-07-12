package com.generadorpublicidad.auth;

import com.generadorpublicidad.auth.dto.AuthResponse;
import com.generadorpublicidad.auth.dto.LoginRequest;
import com.generadorpublicidad.auth.dto.RegisterRequest;
import com.generadorpublicidad.auth.model.User;
import com.generadorpublicidad.auth.repository.UserRepository;
import com.generadorpublicidad.auth.security.JwtProvider;
import com.generadorpublicidad.auth.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtProvider jwtProvider;

    private PasswordEncoder passwordEncoder;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        authService = new AuthService(userRepository, passwordEncoder, jwtProvider);
    }

    @Test
    void register_createsUserAndReturnsToken() {
        var request = new RegisterRequest("Test User", "test@test.com", "password123");
        when(userRepository.existsByEmail("test@test.com")).thenReturn(false);
        when(userRepository.save(any())).thenAnswer(invocation -> {
            var user = invocation.<User>getArgument(0);
            var field = User.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(user, 1L);
            return user;
        });
        when(jwtProvider.generateToken(1L, "test@test.com")).thenReturn("mock-token");

        var response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock-token", response.token());
        assertEquals("Test User", response.user().name());
        assertEquals("test@test.com", response.user().email());
        assertEquals(User.Role.EDITOR, response.user().role());
        verify(userRepository).save(any());
    }

    @Test
    void register_throwsWhenEmailExists() {
        var request = new RegisterRequest("Test", "existing@test.com", "pass123");
        when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_returnsTokenOnSuccess() {
        var request = new LoginRequest("test@test.com", "password123");
        var encodedPassword = passwordEncoder.encode("password123");
        var user = User.builder()
                .id(1L)
                .name("Test")
                .email("test@test.com")
                .password(encodedPassword)
                .role(User.Role.EDITOR)
                .build();

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(jwtProvider.generateToken(1L, "test@test.com")).thenReturn("mock-token");

        var response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock-token", response.token());
        assertEquals("Test", response.user().name());
    }

    @Test
    void login_throwsWhenEmailNotFound() {
        var request = new LoginRequest("notfound@test.com", "pass123");
        when(userRepository.findByEmail("notfound@test.com")).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }

    @Test
    void login_throwsWhenPasswordWrong() {
        var request = new LoginRequest("test@test.com", "wrongpass");
        var encodedPassword = passwordEncoder.encode("correctpass");
        var user = User.builder()
                .id(1L)
                .name("Test")
                .email("test@test.com")
                .password(encodedPassword)
                .build();

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }
}
