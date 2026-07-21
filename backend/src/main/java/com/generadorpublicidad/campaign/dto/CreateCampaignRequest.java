package com.generadorpublicidad.campaign.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCampaignRequest(
        @NotBlank @Size(min = 1, max = 200) String name,
        @Size(max = 2000) String description
) {}
