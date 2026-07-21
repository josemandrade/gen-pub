package com.generadorpublicidad.ai;

import com.generadorpublicidad.ad.dto.GenerateCopyRequest;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class NoOpAiClientTest {

    private final NoOpAiClient client = new NoOpAiClient();

    @Test
    void generateCopy_returnsExpectedHardcodedCopy() {
        var request = new GenerateCopyRequest("Test prompt, long enough to be valid", List.of());

        var result = client.generateCopy(request);

        assertEquals("Anuncio de prueba", result.title());
        assertTrue(result.description().contains("Test prompt, long enough to be valid"));
        assertEquals(3, result.imageSuggestions().size());
        assertTrue(result.imageSuggestions().contains("innovación"));
        assertTrue(result.imageSuggestions().contains("calidad"));
        assertTrue(result.imageSuggestions().contains("confianza"));
    }
}
