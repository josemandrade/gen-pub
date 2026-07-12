package com.generadorpublicidad.ai;

import com.generadorpublicidad.ad.dto.GenerateCopyRequest;

public interface AIClient {

    GeneratedCopy generateCopy(GenerateCopyRequest request);
}
