package com.generadorpublicidad.auth.dto;

import com.generadorpublicidad.auth.model.User;

public record AuthResponse(
        String token,
        UserDto user
) {
    public static AuthResponse of(String token, User user) {
        return new AuthResponse(token, new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole()));
    }

    public record UserDto(Long id, String name, String email, User.Role role) {}
}
