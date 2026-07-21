package com.generadorpublicidad.common;

import com.generadorpublicidad.ad.model.Ad;
import com.generadorpublicidad.ad.repository.AdRepository;
import com.generadorpublicidad.auth.model.User;
import com.generadorpublicidad.auth.repository.UserRepository;
import com.generadorpublicidad.campaign.model.Campaign;
import com.generadorpublicidad.campaign.repository.CampaignRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DataSeederTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CampaignRepository campaignRepository;

    @Mock
    private AdRepository adRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Captor
    private ArgumentCaptor<User> userCaptor;

    @Test
    void createsAdminUserAndSampleDataWhenDatabaseIsEmpty() throws Exception {
        when(userRepository.count()).thenReturn(0L);
        when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
        when(userRepository.save(any())).thenAnswer(invocation -> {
            var user = invocation.<User>getArgument(0);
            var idField = User.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(user, 1L);
            return user;
        });
        when(campaignRepository.save(any())).thenAnswer(invocation -> {
            var campaign = invocation.<Campaign>getArgument(0);
            var idField = Campaign.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(campaign, 1L);
            return campaign;
        });
        when(adRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var seeder = new DataSeeder(userRepository, campaignRepository, adRepository, passwordEncoder);
        seeder.run();

        verify(userRepository).save(userCaptor.capture());
        var saved = userCaptor.getValue();
        assertEquals("Admin", saved.getName());
        assertEquals("admin@test.com", saved.getEmail());
        assertEquals("encoded-password", saved.getPassword());
        assertEquals(User.Role.ADMIN, saved.getRole());

        verify(campaignRepository).save(any());
        verify(adRepository).save(any());
    }

    @Test
    void doesNotCreateUserWhenDatabaseHasRecords() throws Exception {
        when(userRepository.count()).thenReturn(5L);

        var seeder = new DataSeeder(userRepository, campaignRepository, adRepository, passwordEncoder);
        seeder.run();

        verify(userRepository, never()).save(any());
        verify(campaignRepository, never()).save(any());
        verify(adRepository, never()).save(any());
    }
}
