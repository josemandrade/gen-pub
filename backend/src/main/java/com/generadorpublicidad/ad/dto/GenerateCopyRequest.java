package com.generadorpublicidad.ad.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record GenerateCopyRequest(
        @NotBlank @Size(min = 10, max = 1000) String prompt,
        List<Long> mediaIds
) {}
