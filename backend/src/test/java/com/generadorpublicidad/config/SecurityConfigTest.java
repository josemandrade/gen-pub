package com.generadorpublicidad.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FilterChainProxy springSecurityFilterChain;

    @Test
    void registerEndpointIsPublic() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content("{\"name\":\"T\",\"email\":\"t@t.com\",\"password\":\"123456\"}"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void loginEndpointIsPublic() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content("{\"email\":\"t@t.com\",\"password\":\"123456\"}"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void swaggerEndpointsRequireAdmin() throws Exception {
        mockMvc.perform(get("/api-docs"))
                .andExpect(status().isForbidden());
    }

    @Test
    void protectedEndpointReturns403WhenNoToken() throws Exception {
        mockMvc.perform(get("/api/campaigns"))
                .andExpect(status().isForbidden());
    }

    @Test
    void csrfIsDisabled() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content("{\"email\":\"t@t.com\",\"password\":\"123456\"}")
                        .header("X-CSRF-TOKEN", "csrf-value"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void jwtFilterIsRegisteredBeforeUsernamePasswordFilter() {
        boolean jwtFound = springSecurityFilterChain.getFilterChains().stream()
                .anyMatch(chain -> chain.getFilters().stream()
                        .anyMatch(f -> f.getClass().getSimpleName().equals("JwtAuthenticationFilter")));
        assertTrue(jwtFound, "JwtAuthenticationFilter debe estar registrado en la cadena");
    }
}
