package com.generadorpublicidad.campaign.service;

import com.generadorpublicidad.auth.repository.UserRepository;
import com.generadorpublicidad.campaign.dto.CampaignResponse;
import com.generadorpublicidad.campaign.model.Campaign;
import com.generadorpublicidad.campaign.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;

    public List<CampaignResponse> findByCurrentUser(Authentication auth) {
        var user = (com.generadorpublicidad.auth.model.User) auth.getPrincipal();
        return campaignRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(CampaignResponse::of)
                .toList();
    }

    public CampaignResponse findById(Long id, Authentication auth) {
        var user = (com.generadorpublicidad.auth.model.User) auth.getPrincipal();
        return campaignRepository.findById(id)
                .filter(c -> c.getUser().getId().equals(user.getId()))
                .map(CampaignResponse::of)
                .orElseThrow(() -> new IllegalArgumentException("Campaña no encontrada: " + id));
    }

    public CampaignResponse create(String name, String description, Authentication auth) {
        var user = (com.generadorpublicidad.auth.model.User) auth.getPrincipal();
        var campaign = Campaign.builder()
                .name(name)
                .description(description)
                .status(Campaign.Status.DRAFT)
                .user(user)
                .build();
        return CampaignResponse.of(campaignRepository.save(campaign));
    }
}
