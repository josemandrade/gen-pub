package com.generadorpublicidad.common;

import com.generadorpublicidad.ad.model.Ad;
import com.generadorpublicidad.ad.repository.AdRepository;
import com.generadorpublicidad.auth.model.User;
import com.generadorpublicidad.auth.repository.UserRepository;
import com.generadorpublicidad.campaign.model.Campaign;
import com.generadorpublicidad.campaign.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile({"dev", "e2e"})
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CampaignRepository campaignRepository;
    private final AdRepository adRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Ya existen usuarios en la BD, se omite seeding");
            return;
        }

        var user = User.builder()
                .name("Admin")
                .email("admin@test.com")
                .password(passwordEncoder.encode("password123"))
                .role(User.Role.ADMIN)
                .build();

        userRepository.save(user);
        log.info("Usuario de prueba creado: admin@test.com");

        var campaign = Campaign.builder()
                .name("Campaña de ejemplo")
                .description("Campaña creada automáticamente para tests")
                .status(Campaign.Status.DRAFT)
                .user(user)
                .build();

        campaignRepository.save(campaign);
        log.info("Campaña de prueba creada: {}", campaign.getName());

        var ad = Ad.builder()
                .campaign(campaign)
                .title("Anuncio de ejemplo")
                .description("Este es un anuncio de prueba generado automáticamente")
                .status(Ad.Status.DRAFT)
                .build();

        adRepository.save(ad);
        log.info("Anuncio de prueba creado: {}", ad.getTitle());
    }
}
