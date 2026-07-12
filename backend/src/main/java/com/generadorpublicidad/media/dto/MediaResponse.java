package com.generadorpublicidad.media.dto;

import com.generadorpublicidad.media.model.Media;

import java.time.OffsetDateTime;

public record MediaResponse(
        Long id,
        Long adId,
        String originalName,
        String contentType,
        Long size,
        String mediaType,
        String url,
        OffsetDateTime createdAt
) {
    public static MediaResponse of(Media media) {
        return new MediaResponse(
                media.getId(),
                media.getAd().getId(),
                media.getOriginalName(),
                media.getContentType(),
                media.getSize(),
                media.getMediaType().name(),
                media.getUrl(),
                media.getCreatedAt()
        );
    }
}
