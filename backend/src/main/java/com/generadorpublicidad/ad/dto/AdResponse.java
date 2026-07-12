package com.generadorpublicidad.ad.dto;

import com.generadorpublicidad.ad.model.Ad;
import com.generadorpublicidad.media.dto.MediaResponse;

import java.time.OffsetDateTime;
import java.util.List;

public record AdResponse(
        Long id,
        Long campaignId,
        String campaignName,
        String title,
        String description,
        Ad.Status status,
        List<MediaResponse> media,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
    public static AdResponse of(Ad ad, List<MediaResponse> media) {
        return new AdResponse(
                ad.getId(),
                ad.getCampaign().getId(),
                ad.getCampaign().getName(),
                ad.getTitle(),
                ad.getDescription(),
                ad.getStatus(),
                media,
                ad.getCreatedAt(),
                ad.getUpdatedAt()
        );
    }
}
