package com.generadorpublicidad.ai;

import java.util.List;

public record GeneratedCopy(
        String title,
        String description,
        List<String> imageSuggestions
) {}
