package com.generadorpublicidad.ad.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateAdRequest(
        @NotNull Long campaignId,
        @NotBlank String title,
        String description
) {}
