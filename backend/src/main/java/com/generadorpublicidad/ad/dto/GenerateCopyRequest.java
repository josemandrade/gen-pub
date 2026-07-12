package com.generadorpublicidad.ad.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record GenerateCopyRequest(
        @NotBlank String prompt,
        List<Long> mediaIds
) {}
