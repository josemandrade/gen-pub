package com.generadorpublicidad.ad.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateAdRequest(
        @NotNull Long campaignId,
        @NotBlank @Size(min = 1, max = 200) String title,
        @Size(max = 2000) String description
) {}
