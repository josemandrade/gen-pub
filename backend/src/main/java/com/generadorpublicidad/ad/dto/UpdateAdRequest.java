package com.generadorpublicidad.ad.dto;

public record UpdateAdRequest(
        String title,
        String description,
        String status
) {}
