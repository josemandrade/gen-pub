package com.generadorpublicidad.ai;

import com.generadorpublicidad.ad.dto.GenerateCopyRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@ConditionalOnProperty(name = "app.ai.openai.api-key")
@Slf4j
public class OpenAiClient implements AIClient {

    private static final Pattern JSON_BLOCK = Pattern.compile(
            "```(?:json)?\\s*([\\s\\S]*?)```", Pattern.MULTILINE
    );

    private final RestClient restClient;
    private final String apiKey;
    private final String model;
    private final ObjectMapper objectMapper;

    public OpenAiClient(
            RestClient.Builder restClientBuilder,
            @Value("${app.ai.openai.api-key:}") String apiKey,
            @Value("${app.ai.openai.model:gpt-4}") String model
    ) {
        this.restClient = restClientBuilder.build();
        this.apiKey = apiKey;
        this.model = model;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public GeneratedCopy generateCopy(GenerateCopyRequest request) {
        String prompt = buildPrompt(request);

        var body = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "system", "content", "Eres un experto en marketing digital y redacción publicitaria."),
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.7,
                "max_tokens", 500,
                "response_format", Map.of("type", "json_object")
        );

        try {
            var response = restClient.post()
                    .uri("https://api.openai.com/v1/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            return parseResponse(response);
        } catch (AiServiceException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error llamando a OpenAI: {}", e.getMessage());
            throw new AiServiceException("No se pudo generar el copy: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(GenerateCopyRequest request) {
        return """
                Genera un anuncio publicitario basado en lo siguiente:
                
                Contexto: %s
                
                Necesito:
                1. Un título llamativo (máx 60 caracteres)
                2. Una descripción persuasiva (máx 200 caracteres)
                3. 3 sugerencias de palabras clave para imágenes que complementen el anuncio
                
                Responde en formato JSON:
                { "title": "...", "description": "...", "imageSuggestions": ["...", "...", "..."] }
                """.formatted(request.prompt());
    }

    @SuppressWarnings("unchecked")
    private GeneratedCopy parseResponse(Map<String, Object> responseBody) {
        try {
            var choices = (List<Map<String, Object>>) responseBody.get("choices");
            if (choices == null || choices.isEmpty()) {
                throw new AiServiceException("Sin respuesta de OpenAI");
            }
            var message = (Map<String, Object>) choices.get(0).get("message");
            var content = (String) message.get("content");
            String json = extractJson(content);
            return objectMapper.readValue(json, GeneratedCopy.class);
        } catch (AiServiceException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error parseando respuesta de OpenAI: {}", e.getMessage());
            throw new AiServiceException("Error al procesar respuesta de OpenAI: " + e.getMessage(), e);
        }
    }

    private String extractJson(String content) {
        if (content == null) return "{}";
        var matcher = JSON_BLOCK.matcher(content);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return content.trim();
    }
}
