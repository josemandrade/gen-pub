package com.generadorpublicidad;

import com.generadorpublicidad.ad.service.AdService;
import com.generadorpublicidad.auth.security.JwtProvider;
import com.generadorpublicidad.auth.service.AuthService;
import com.generadorpublicidad.campaign.service.CampaignService;
import com.generadorpublicidad.storage.StorageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
class GeneradorPublicidadApplicationTests {

    @Autowired
    private ApplicationContext context;

    @Autowired
    private AuthService authService;

    @Autowired
    private AdService adService;

    @Autowired
    private CampaignService campaignService;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private StorageService storageService;

    @Test
    void contextLoads() {
        assertNotNull(context);
    }

    @Test
    void allCoreBeansExist() {
        assertNotNull(authService);
        assertNotNull(adService);
        assertNotNull(campaignService);
        assertNotNull(jwtProvider);
        assertNotNull(storageService);
    }
}
