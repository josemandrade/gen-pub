package com.generadorpublicidad.campaign;

import com.generadorpublicidad.auth.model.User;
import com.generadorpublicidad.auth.repository.UserRepository;
import com.generadorpublicidad.campaign.model.Campaign;
import com.generadorpublicidad.campaign.repository.CampaignRepository;
import com.generadorpublicidad.campaign.service.CampaignService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CampaignServiceTest {

    @Mock
    private CampaignRepository campaignRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication auth;

    private CampaignService campaignService;
    private User testUser;

    @BeforeEach
    void setUp() {
        campaignService = new CampaignService(campaignRepository, userRepository);
        testUser = User.builder().id(1L).name("Test").email("test@test.com").password("encoded").role(User.Role.EDITOR).build();
    }

    @Test
    void findByCurrentUser_returnsCampaigns() {
        when(auth.getPrincipal()).thenReturn(testUser);
        var campaigns = List.of(
                campaign(1L, "Camp 1"),
                campaign(2L, "Camp 2")
        );
        when(campaignRepository.findByUserIdOrderByCreatedAtDesc(1L)).thenReturn(campaigns);

        var result = campaignService.findByCurrentUser(auth);

        assertEquals(2, result.size());
        assertEquals("Camp 1", result.get(0).name());
        assertEquals("Camp 2", result.get(1).name());
    }

    @Test
    void findByCurrentUser_returnsEmptyList() {
        when(auth.getPrincipal()).thenReturn(testUser);
        when(campaignRepository.findByUserIdOrderByCreatedAtDesc(1L)).thenReturn(List.of());

        var result = campaignService.findByCurrentUser(auth);

        assertTrue(result.isEmpty());
    }

    @Test
    void findById_returnsCampaign() {
        var campaign = campaign(1L, "Test Campaign");
        when(campaignRepository.findById(1L)).thenReturn(Optional.of(campaign));
        when(auth.getPrincipal()).thenReturn(testUser);

        var result = campaignService.findById(1L, auth);

        assertEquals("Test Campaign", result.name());
    }

    @Test
    void findById_throwsWhenNotFound() {
        when(campaignRepository.findById(99L)).thenReturn(Optional.empty());
        when(auth.getPrincipal()).thenReturn(testUser);

        var ex = assertThrows(IllegalArgumentException.class, () -> campaignService.findById(99L, auth));
        assertEquals("Campaña no encontrada: 99", ex.getMessage());
    }

    @Test
    void create_savesAndReturnsCampaign() {
        when(auth.getPrincipal()).thenReturn(testUser);
        when(campaignRepository.save(any())).thenAnswer(inv -> {
            var c = inv.<Campaign>getArgument(0);
            var field = Campaign.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(c, 1L);
            return c;
        });

        var result = campaignService.create("New Campaign", "Description", auth);

        assertEquals("New Campaign", result.name());
        assertEquals("Description", result.description());
        assertEquals(Campaign.Status.DRAFT, result.status());
        verify(campaignRepository).save(any());
    }

    @Test
    void findById_throwsWhenCampaignBelongsToOtherUser() {
        var otherUser = User.builder().id(2L).name("Other").email("other@test.com").password("enc").role(User.Role.EDITOR).build();
        var campaign = campaign(1L, "Other Campaign");
        campaign.setUser(otherUser);

        when(campaignRepository.findById(1L)).thenReturn(Optional.of(campaign));
        when(auth.getPrincipal()).thenReturn(testUser);

        var ex = assertThrows(IllegalArgumentException.class, () -> campaignService.findById(1L, auth));
        assertEquals("Campaña no encontrada: 1", ex.getMessage());
    }

    private Campaign campaign(Long id, String name) {
        var c = new Campaign();
        c.setId(id);
        c.setName(name);
        c.setDescription("Desc");
        c.setStatus(Campaign.Status.DRAFT);
        c.setUser(testUser);
        return c;
    }
}
