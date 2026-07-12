package com.generadorpublicidad.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    String store(MultipartFile file, String subdirectory);

    void delete(String fileUrl);

    Resource loadAsResource(String fileUrl);
}
