package com.generadorpublicidad.ad;

import com.generadorpublicidad.ad.model.Ad;
import com.generadorpublicidad.ad.repository.AdRepository;
import com.generadorpublicidad.auth.model.User;
import com.generadorpublicidad.auth.repository.UserRepository;
import com.generadorpublicidad.campaign.model.Campaign;
import com.generadorpublicidad.campaign.repository.CampaignRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class AdRepositoryTest {

    @Autowired
    private AdRepository adRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private UserRepository userRepository;

    private User user;
    private Campaign campaign;

    @BeforeEach
    void setUp() {
        user = userRepository.save(User.builder()
                .name("Test User")
                .email("test" + System.nanoTime() + "@test.com")
                .password("encoded")
                .role(User.Role.EDITOR)
                .build());

        campaign = campaignRepository.save(Campaign.builder()
                .name("Test Campaign")
                .description("Desc")
                .status(Campaign.Status.DRAFT)
                .user(user)
                .build());
    }

    @Test
    void findByCampaignIdOrderByCreatedAtDesc_returnsAdsInOrder() {
        var ad1 = adRepository.save(Ad.builder().campaign(campaign).title("Ad 1").description("Desc 1").status(Ad.Status.DRAFT).build());
        var ad2 = adRepository.save(Ad.builder().campaign(campaign).title("Ad 2").description("Desc 2").status(Ad.Status.GENERATED).build());

        var result = adRepository.findByCampaignIdOrderByCreatedAtDesc(campaign.getId());

        assertEquals(2, result.size());
        assertEquals("Ad 2", result.get(0).getTitle());
        assertEquals("Ad 1", result.get(1).getTitle());
    }

    @Test
    void findByCampaignId_returnsEmptyWhenNoAds() {
        var result = adRepository.findByCampaignIdOrderByCreatedAtDesc(campaign.getId());
        assertTrue(result.isEmpty());
    }

    @Test
    void findByUserId_returnsUserAds() {
        adRepository.save(Ad.builder().campaign(campaign).title("Ad 1").status(Ad.Status.DRAFT).build());

        var result = adRepository.findByUserId(user.getId());

        assertEquals(1, result.size());
        assertEquals("Ad 1", result.get(0).getTitle());
    }

    @Test
    void findByUserId_doesNotReturnOtherUserAds() {
        var otherUser = userRepository.save(User.builder()
                .name("Other")
                .email("other" + System.nanoTime() + "@test.com")
                .password("encoded")
                .role(User.Role.EDITOR)
                .build());
        var otherCampaign = campaignRepository.save(Campaign.builder()
                .name("Other Campaign").status(Campaign.Status.DRAFT).user(otherUser).build());
        adRepository.save(Ad.builder().campaign(otherCampaign).title("Other Ad").status(Ad.Status.DRAFT).build());

        var result = adRepository.findByUserId(user.getId());
        assertTrue(result.isEmpty());
    }

    @Test
    void findByIdWithCampaign_loadsCampaign() {
        var saved = adRepository.save(Ad.builder().campaign(campaign).title("Test").status(Ad.Status.DRAFT).build());

        var result = adRepository.findByIdWithCampaign(saved.getId());

        assertTrue(result.isPresent());
        assertNotNull(result.get().getCampaign());
        assertEquals("Test Campaign", result.get().getCampaign().getName());
    }

    @Test
    void findByIdWithCampaign_returnsEmptyWhenNotFound() {
        var result = adRepository.findByIdWithCampaign(999L);
        assertFalse(result.isPresent());
    }
}
