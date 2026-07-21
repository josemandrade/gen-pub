package com.generadorpublicidad.ad.dto;

import jakarta.validation.constraints.Size;

public record UpdateAdRequest(
        @Size(min = 1, max = 200) String title,
        @Size(max = 2000) String description,
        String status
) {}
