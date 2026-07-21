package com.generadorpublicidad.campaign;

import com.generadorpublicidad.auth.model.User;
import com.generadorpublicidad.auth.repository.UserRepository;
import com.generadorpublicidad.campaign.model.Campaign;
import com.generadorpublicidad.campaign.repository.CampaignRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.temporal.ChronoUnit;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class CampaignRepositoryTest {

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private UserRepository userRepository;

    private User user;
    private User otherUser;

    @BeforeEach
    void setUp() {
        user = userRepository.save(User.builder()
                .name("Test User")
                .email("test" + System.nanoTime() + "@test.com")
                .password("encoded")
                .role(User.Role.EDITOR)
                .build());

        otherUser = userRepository.save(User.builder()
                .name("Other")
                .email("other" + System.nanoTime() + "@test.com")
                .password("encoded")
                .role(User.Role.EDITOR)
                .build());
    }

    @Test
    void findByUserIdOrderByCreatedAtDesc_returnsCampaignsInOrder() {
        var c1 = campaignRepository.save(Campaign.builder().name("First").status(Campaign.Status.DRAFT).user(user).build());
        var c2 = campaignRepository.save(Campaign.builder().name("Second").status(Campaign.Status.ACTIVE).user(user).build());

        var result = campaignRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        assertEquals(2, result.size());
        assertEquals("Second", result.get(0).getName());
        assertTrue(result.get(0).getCreatedAt().isAfter(result.get(1).getCreatedAt())
                || result.get(0).getCreatedAt().truncatedTo(ChronoUnit.SECONDS)
                .equals(result.get(1).getCreatedAt().truncatedTo(ChronoUnit.SECONDS)));
    }

    @Test
    void findByUserId_doesNotReturnOtherUserCampaigns() {
        campaignRepository.save(Campaign.builder().name("Mine").status(Campaign.Status.DRAFT).user(user).build());
        campaignRepository.save(Campaign.builder().name("Theirs").status(Campaign.Status.DRAFT).user(otherUser).build());

        var result = campaignRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        assertEquals(1, result.size());
        assertEquals("Mine", result.get(0).getName());
    }

    @Test
    void findByUserId_returnsEmptyWhenNoCampaigns() {
        var result = campaignRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        assertTrue(result.isEmpty());
    }

    @Test
    void saveAndFindById_works() {
        var saved = campaignRepository.save(Campaign.builder()
                .name("Saved Campaign").status(Campaign.Status.DRAFT).user(user).build());

        var found = campaignRepository.findById(saved.getId());

        assertTrue(found.isPresent());
        assertEquals("Saved Campaign", found.get().getName());
    }
}
