package com.generadorpublicidad.ad;

import com.generadorpublicidad.ad.controller.AdController;
import com.generadorpublicidad.ad.dto.AdResponse;
import com.generadorpublicidad.ad.model.Ad;
import com.generadorpublicidad.ad.service.AdService;
import com.generadorpublicidad.ai.GeneratedCopy;
import com.generadorpublicidad.auth.model.User;
import com.generadorpublicidad.auth.repository.UserRepository;
import com.generadorpublicidad.auth.security.JwtAuthenticationFilter;
import com.generadorpublicidad.auth.security.JwtProvider;
import com.generadorpublicidad.config.SecurityConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class AdControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdService adService;

    @MockitoBean
    private JwtProvider jwtProvider;

    @MockitoBean
    private UserRepository userRepository;

    private static final AdResponse AD_RESPONSE = new AdResponse(
            1L, 1L, "Campaign", "Test Ad", "Description",
            Ad.Status.DRAFT, List.of(),
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
        when(adService.findByCampaignId(eq(1L), any())).thenReturn(List.of(AD_RESPONSE));

        mockMvc.perform(get("/api/ads").param("campaignId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Ad"));
    }

    @Test
    void listMy_returns200() throws Exception {
        when(adService.findByUserId(anyLong())).thenReturn(List.of(AD_RESPONSE));

        mockMvc.perform(get("/api/ads/my"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Ad"));
    }

    @Test
    void getById_returns200() throws Exception {
        when(adService.findById(eq(1L), any())).thenReturn(AD_RESPONSE);

        mockMvc.perform(get("/api/ads/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Ad"));
    }

    @Test
    void getById_returns400WhenNotFound() throws Exception {
        when(adService.findById(eq(99L), any())).thenThrow(new IllegalArgumentException("Anuncio no encontrado: 99"));

        mockMvc.perform(get("/api/ads/99"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"));
    }

    @Test
    void create_returns201() throws Exception {
        when(adService.create(any(), any())).thenReturn(AD_RESPONSE);

        mockMvc.perform(post("/api/ads")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"campaignId\":1,\"title\":\"Test Ad\",\"description\":\"Description\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.campaignId").value(1));
    }

    @Test
    void create_returns400WhenInvalid() throws Exception {
        mockMvc.perform(post("/api/ads")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"campaignId\":null,\"title\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Error"));
    }

    @Test
    void update_returns200() throws Exception {
        when(adService.update(eq(1L), any(), any())).thenReturn(AD_RESPONSE);

        mockMvc.perform(put("/api/ads/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Updated\",\"description\":\"Updated desc\",\"status\":\"GENERATED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Ad"));
    }

    @Test
    void delete_returns204() throws Exception {
        doNothing().when(adService).delete(eq(1L), any());

        mockMvc.perform(delete("/api/ads/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void uploadMedia_returns200() throws Exception {
        when(adService.uploadMedia(eq(1L), anyList(), any())).thenReturn(AD_RESPONSE);
        var file = new MockMultipartFile("files", "test.jpg", "image/jpeg", "data".getBytes());

        mockMvc.perform(multipart("/api/ads/1/media")
                        .file(file))
                .andExpect(status().isOk());
    }

    @Test
    void deleteMedia_returns204() throws Exception {
        doNothing().when(adService).deleteMedia(eq(1L), any());

        mockMvc.perform(delete("/api/ads/media/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void generateCopy_returns200() throws Exception {
        var copy = new GeneratedCopy("Title", "Desc", List.of("kw1"));
        when(adService.generateCopy(any())).thenReturn(copy);

        mockMvc.perform(post("/api/ads/generate-copy")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"prompt\":\"create an ad\",\"keywords\":[]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Title"))
                .andExpect(jsonPath("$.description").value("Desc"));
    }

    @Test
    void allEndpoints_returns403WhenNotAuthenticated() throws Exception {
        SecurityContextHolder.clearContext();
        mockMvc.perform(get("/api/ads").param("campaignId", "1")).andExpect(status().isForbidden());
        mockMvc.perform(get("/api/ads/my")).andExpect(status().isForbidden());
        mockMvc.perform(get("/api/ads/1")).andExpect(status().isForbidden());
        mockMvc.perform(post("/api/ads").contentType(MediaType.APPLICATION_JSON).content("{}")).andExpect(status().isForbidden());
        mockMvc.perform(put("/api/ads/1").contentType(MediaType.APPLICATION_JSON).content("{}")).andExpect(status().isForbidden());
        mockMvc.perform(delete("/api/ads/1")).andExpect(status().isForbidden());
        mockMvc.perform(delete("/api/ads/media/1")).andExpect(status().isForbidden());
    }
}
