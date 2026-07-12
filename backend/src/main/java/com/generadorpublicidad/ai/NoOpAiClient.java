package com.generadorpublicidad.ai;

import com.generadorpublicidad.ad.dto.GenerateCopyRequest;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@ConditionalOnMissingBean({AIClient.class})
public class NoOpAiClient implements AIClient {

    @Override
    public GeneratedCopy generateCopy(GenerateCopyRequest request) {
        return new GeneratedCopy(
                "Anuncio de prueba",
                "Descripción generada para: " + request.prompt(),
                List.of("innovación", "calidad", "confianza")
        );
    }
}
