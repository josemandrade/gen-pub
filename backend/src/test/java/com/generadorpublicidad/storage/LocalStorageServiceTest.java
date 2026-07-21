package com.generadorpublicidad.storage;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LocalStorageServiceTest {

    @TempDir
    Path tempDir;

    private LocalStorageService storageService;

    @BeforeEach
    void setUp() {
        storageService = new LocalStorageService(tempDir.toString());
        storageService.init();
    }

    @Test
    void store_savesFileAndReturnsUrl() throws IOException {
        var file = mock(MultipartFile.class);
        when(file.getInputStream()).thenReturn(new ByteArrayInputStream("data".getBytes()));
        when(file.getOriginalFilename()).thenReturn("photo.jpg");

        var url = storageService.store(file, "ads/1");

        assertTrue(url.startsWith("/uploads/ads/1/"));
        assertTrue(url.endsWith(".jpg"));
        assertTrue(Files.exists(tempDir.resolve("ads/1").resolve(url.substring("/uploads/ads/1/".length()))));
    }

    @Test
    void store_createsSubdirectories() throws IOException {
        var file = mock(MultipartFile.class);
        when(file.getInputStream()).thenReturn(new ByteArrayInputStream("data".getBytes()));
        when(file.getOriginalFilename()).thenReturn("test.png");

        storageService.store(file, "deeply/nested/path");

        assertTrue(Files.exists(tempDir.resolve("deeply/nested/path")));
    }

    @Test
    void store_generatesUniqueNames() throws IOException {
        var file = mock(MultipartFile.class);
        when(file.getInputStream()).thenReturn(new ByteArrayInputStream("data".getBytes()));
        when(file.getOriginalFilename()).thenReturn("test.jpg");

        var url1 = storageService.store(file, "sub");
        var url2 = storageService.store(file, "sub");

        assertNotEquals(url1, url2);
    }

    @Test
    void delete_removesExistingFile() throws Exception {
        var file = mock(MultipartFile.class);
        when(file.getInputStream()).thenReturn(new ByteArrayInputStream("data".getBytes()));
        when(file.getOriginalFilename()).thenReturn("test.jpg");
        var url = storageService.store(file, "del");

        storageService.delete(url);

        var path = tempDir.resolve("del").resolve(url.substring("/uploads/del/".length()));
        assertFalse(Files.exists(path));
    }

    @Test
    void delete_doesNotThrowWhenFileNotFound() {
        assertDoesNotThrow(() -> storageService.delete("/uploads/nonexistent/file.jpg"));
    }

    @Test
    void delete_returnsWithoutErrorForInvalidUrl() {
        assertDoesNotThrow(() -> storageService.delete(null));
        assertDoesNotThrow(() -> storageService.delete("invalid-url"));
    }

    @Test
    void loadAsResource_loadsExistingFile() throws IOException {
        var file = mock(MultipartFile.class);
        when(file.getInputStream()).thenReturn(new ByteArrayInputStream("hello".getBytes()));
        when(file.getOriginalFilename()).thenReturn("test.txt");
        var url = storageService.store(file, "load");

        var resource = storageService.loadAsResource(url);

        assertNotNull(resource);
        assertTrue(resource.exists());
    }

    @Test
    void loadAsResource_throwsForInvalidUrl() {
        assertThrows(RuntimeException.class, () -> storageService.loadAsResource(null));
        assertThrows(RuntimeException.class, () -> storageService.loadAsResource("/invalid/path"));
    }

    @Test
    void resolvePath_preventsTraversal() throws IOException {
        var file = mock(MultipartFile.class);
        when(file.getInputStream()).thenReturn(new ByteArrayInputStream("data".getBytes()));
        when(file.getOriginalFilename()).thenReturn("test.txt");
        storageService.store(file, "safe");

        assertThrows(RuntimeException.class,
                () -> storageService.loadAsResource("/uploads/../../etc/passwd"));
    }

    @Test
    void extractExtension_worksCorrectly() {
        assertEquals(".jpg", extractExtension("photo.jpg"));
        assertEquals("", extractExtension("noext"));
        assertEquals(".txt", extractExtension("a.b.c.txt"));
        assertEquals("", extractExtension(null));
    }

    private String extractExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }
}
