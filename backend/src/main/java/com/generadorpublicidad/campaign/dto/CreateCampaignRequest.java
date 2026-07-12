package com.generadorpublicidad.campaign.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateCampaignRequest(
        @NotBlank String name,
        String description
) {}
