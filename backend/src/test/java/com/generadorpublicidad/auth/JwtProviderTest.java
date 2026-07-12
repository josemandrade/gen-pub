package com.generadorpublicidad.auth;

import com.generadorpublicidad.auth.security.JwtProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtProviderTest {

    private JwtProvider jwtProvider;

    @BeforeEach
    void setUp() {
        jwtProvider = new JwtProvider(
                "test-secret-key-that-is-at-least-256-bits-long-for-testing-123456",
                3600000
        );
    }

    @Test
    void generateAndValidateToken() {
        var token = jwtProvider.generateToken(1L, "test@test.com");
        assertNotNull(token);
        assertTrue(jwtProvider.validateToken(token));
    }

    @Test
    void getUserIdFromToken() {
        var token = jwtProvider.generateToken(42L, "user@test.com");
        var userId = jwtProvider.getUserIdFromToken(token);
        assertEquals(42L, userId);
    }

    @Test
    void invalidTokenReturnsFalse() {
        assertFalse(jwtProvider.validateToken("invalid-token"));
    }

    @Test
    void expiredTokenReturnsFalse() {
        var shortLived = new JwtProvider("test-secret-key-that-is-at-least-256-bits-long-for-testing-123456", -1);
        var token = shortLived.generateToken(1L, "test@test.com");
        assertFalse(shortLived.validateToken(token));
    }
}
