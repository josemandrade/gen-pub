package com.generadorpublicidad.ai;

import com.generadorpublicidad.ad.dto.GenerateCopyRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OpenAiClientTest {

    @Mock
    private RestClient.Builder restClientBuilder;

    @Mock
    private RestClient restClient;

    @Mock
    private RestClient.RequestBodyUriSpec requestBodyUriSpec;

    @Mock
    private RestClient.ResponseSpec responseSpec;

    private OpenAiClient openAiClient;

    @BeforeEach
    void setUp() {
        lenient().when(restClientBuilder.build()).thenReturn(restClient);
        openAiClient = new OpenAiClient(restClientBuilder, "test-api-key-1234567890123456", "gpt-4");
    }

    @SuppressWarnings("unchecked")
    private void stubOpenAiCall(Map<?, ?> openAiResponse) {
        when(restClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(any(String.class))).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.header(any(), any())).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.contentType(any())).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.body(any(Object.class))).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(Map.class)).thenReturn((Map<String, Object>) openAiResponse);
    }

    private void stubNetworkError() {
        when(restClient.post()).thenThrow(new RuntimeException("Connection refused"));
    }

    @Test
    void generateCopy_validMarkdownResponse_returnsGeneratedCopy() {
        var openAiResponse = Map.of(
                "choices", List.of(
                        Map.of("message", Map.of("content",
                                "```json\n{\"title\":\"Sale 20%\",\"description\":\"Descuento especial\",\"imageSuggestions\":[\"kw1\",\"kw2\",\"kw3\"]}\n```"))
                )
        );
        stubOpenAiCall(openAiResponse);

        var result = openAiClient.generateCopy(
                new GenerateCopyRequest("Promoción de verano con descuento del 20% para clientes", List.of()));

        assertEquals("Sale 20%", result.title());
        assertEquals("Descuento especial", result.description());
        assertEquals(3, result.imageSuggestions().size());
    }

    @Test
    void generateCopy_rawJson_returnsGeneratedCopy() {
        var openAiResponse = Map.of(
                "choices", List.of(
                        Map.of("message", Map.of("content",
                                "{\"title\":\"Eco Product\",\"description\":\"100% natural\",\"imageSuggestions\":[\"eco\",\"green\",\"nature\"]}"))
                )
        );
        stubOpenAiCall(openAiResponse);

        var result = openAiClient.generateCopy(
                new GenerateCopyRequest("Producto ecológico natural sostenible", List.of()));

        assertEquals("Eco Product", result.title());
    }

    @Test
    void generateCopy_emptyChoices_throwsAiServiceException() {
        var openAiResponse = Map.of("choices", List.of());
        stubOpenAiCall(openAiResponse);

        assertThrows(AiServiceException.class,
                () -> openAiClient.generateCopy(
                        new GenerateCopyRequest("Test prompt with at least ten chars here", List.of())));
    }

    @Test
    void generateCopy_nullChoices_throwsAiServiceException() {
        var openAiResponse = new HashMap<String, Object>();
        openAiResponse.put("choices", null);
        stubOpenAiCall(openAiResponse);

        assertThrows(AiServiceException.class,
                () -> openAiClient.generateCopy(
                        new GenerateCopyRequest("Test prompt with at least ten chars here", List.of())));
    }

    @Test
    void generateCopy_invalidJson_throwsAiServiceException() {
        var openAiResponse = Map.of(
                "choices", List.of(
                        Map.of("message", Map.of("content", "not valid json at all"))
                )
        );
        stubOpenAiCall(openAiResponse);

        assertThrows(AiServiceException.class,
                () -> openAiClient.generateCopy(
                        new GenerateCopyRequest("Test prompt with at least ten chars here", List.of())));
    }

    @Test
    void generateCopy_networkError_throwsAiServiceException() {
        stubNetworkError();

        assertThrows(AiServiceException.class,
                () -> openAiClient.generateCopy(
                        new GenerateCopyRequest("Test prompt with at least ten chars here", List.of())));
    }

    @Test
    void generateCopy_nullContent_returnsGeneratedCopyWithDefaults() {
        var messageMap = new HashMap<String, Object>();
        messageMap.put("content", null);
        var openAiResponse = Map.of(
                "choices", List.of(
                        Map.of("message", messageMap)
                )
        );
        stubOpenAiCall(openAiResponse);

        var result = openAiClient.generateCopy(
                new GenerateCopyRequest("Test prompt with at least ten chars here", List.of()));

        assertNotNull(result);
        assertNull(result.title());
        assertNull(result.description());
        assertNull(result.imageSuggestions());
    }
}
