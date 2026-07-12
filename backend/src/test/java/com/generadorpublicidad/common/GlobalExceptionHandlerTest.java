package com.generadorpublicidad.common;

import com.generadorpublicidad.common.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler handler;

    @BeforeEach
    void setUp() {
        handler = new GlobalExceptionHandler();
    }

    @Test
    void handleIllegalArgument_returns400() {
        var ex = new IllegalArgumentException("mensaje de error");
        var response = handler.handleIllegalArgument(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        var body = response.getBody();
        assertNotNull(body);
        assertEquals(400, body.status());
        assertEquals("Bad Request", body.error());
        assertEquals("mensaje de error", body.message());
    }

    @Test
    void handleBadCredentials_returns401() {
        var ex = new BadCredentialsException("credenciales inválidas");
        var response = handler.handleBadCredentials(ex);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        var body = response.getBody();
        assertNotNull(body);
        assertEquals(401, body.status());
        assertEquals("Unauthorized", body.error());
    }

    @Test
    void handleValidation_returns400WithFieldErrors() {
        var bindingResult = mock(BindingResult.class);
        var fieldError = new FieldError("obj", "email", "email inválido");
        when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError));

        var ex = mock(MethodArgumentNotValidException.class);
        when(ex.getBindingResult()).thenReturn(bindingResult);

        var response = handler.handleValidation(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        var body = response.getBody();
        assertNotNull(body);
        assertEquals("Validation Error", body.error());
        assertEquals("email inválido", body.message());
    }
}
