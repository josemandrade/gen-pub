package com.generadorpublicidad.campaign;

import com.generadorpublicidad.auth.model.User;
import com.generadorpublicidad.auth.repository.UserRepository;
import com.generadorpublicidad.auth.security.JwtAuthenticationFilter;
import com.generadorpublicidad.auth.security.JwtProvider;
import com.generadorpublicidad.campaign.controller.CampaignController;
import com.generadorpublicidad.campaign.dto.CampaignResponse;
import com.generadorpublicidad.campaign.model.Campaign;
import com.generadorpublicidad.campaign.service.CampaignService;
import com.generadorpublicidad.config.SecurityConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CampaignController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class CampaignControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CampaignService campaignService;

    @MockitoBean
    private JwtProvider jwtProvider;

    @MockitoBean
    private UserRepository userRepository;

    private static final CampaignResponse CAMPAIGN_RESPONSE = new CampaignResponse(
            1L, "Test Campaign", "Description", Campaign.Status.DRAFT,
            OffsetDateTime.now(), OffsetDateTime.now()
    );

    @BeforeEach
    void setUpSecurity() {
        SecurityContextHolder.clearContext();
        var user = User.builder().id(1L).name("Test").email("test@test.com").role(User.Role.EDITOR).build();
        var auth = new UsernamePasswordAuthenticationToken(user, null, List.of(new SimpleGrantedAuthority("ROLE_EDITOR")));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    void list_returns200() throws Exception {
        when(campaignService.findByCurrentUser(any())).thenReturn(List.of(CAMPAIGN_RESPONSE));

        mockMvc.perform(get("/api/campaigns"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Campaign"));
    }

    @Test
    void list_returnsEmptyList() throws Exception {
        when(campaignService.findByCurrentUser(any())).thenReturn(List.of());

        mockMvc.perform(get("/api/campaigns"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void list_returns403WhenNotAuthenticated() throws Exception {
        SecurityContextHolder.clearContext();
        mockMvc.perform(get("/api/campaigns"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getById_returns200() throws Exception {
        when(campaignService.findById(eq(1L), any())).thenReturn(CAMPAIGN_RESPONSE);

        mockMvc.perform(get("/api/campaigns/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Campaign"));
    }

    @Test
    void getById_returns400WhenNotFound() throws Exception {
        when(campaignService.findById(eq(99L), any())).thenThrow(new IllegalArgumentException("Campaña no encontrada: 99"));

        mockMvc.perform(get("/api/campaigns/99"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"));
    }

    @Test
    void create_returns201() throws Exception {
        when(campaignService.create(anyString(), anyString(), any())).thenReturn(CAMPAIGN_RESPONSE);

        mockMvc.perform(post("/api/campaigns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test Campaign\",\"description\":\"Description\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Test Campaign"));
    }

    @Test
    void create_returns400WhenNameBlank() throws Exception {
        mockMvc.perform(post("/api/campaigns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"\",\"description\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Error"));
    }

    @Test
    void create_returns403WhenNotAuthenticated() throws Exception {
        SecurityContextHolder.clearContext();
        mockMvc.perform(post("/api/campaigns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test\",\"description\":\"\"}"))
                .andExpect(status().isForbidden());
    }
}
