package com.generadorpublicidad.campaign.dto;

import com.generadorpublicidad.campaign.model.Campaign;

import java.time.OffsetDateTime;

public record CampaignResponse(
        Long id,
        String name,
        String description,
        Campaign.Status status,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
    public static CampaignResponse of(Campaign campaign) {
        return new CampaignResponse(
                campaign.getId(),
                campaign.getName(),
                campaign.getDescription(),
                campaign.getStatus(),
                campaign.getCreatedAt(),
                campaign.getUpdatedAt()
        );
    }
}
