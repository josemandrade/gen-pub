package com.generadorpublicidad.ad.service;

import com.generadorpublicidad.ad.dto.AdResponse;
import com.generadorpublicidad.ad.dto.CreateAdRequest;
import com.generadorpublicidad.ad.dto.GenerateCopyRequest;
import com.generadorpublicidad.ad.dto.UpdateAdRequest;
import com.generadorpublicidad.ad.model.Ad;
import com.generadorpublicidad.ad.repository.AdRepository;
import com.generadorpublicidad.ai.AIClient;
import com.generadorpublicidad.ai.GeneratedCopy;
import com.generadorpublicidad.campaign.repository.CampaignRepository;
import com.generadorpublicidad.media.dto.MediaResponse;
import com.generadorpublicidad.media.repository.MediaRepository;
import com.generadorpublicidad.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "video/mp4", "video/webm", "video/ogg"
    );

    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

    private final AdRepository adRepository;
    private final CampaignRepository campaignRepository;
    private final MediaRepository mediaRepository;
    private final StorageService storageService;
    private final AIClient aiClient;

    @Transactional(readOnly = true)
    public List<AdResponse> findByCampaignId(Long campaignId) {
        return adRepository.findByCampaignIdOrderByCreatedAtDesc(campaignId)
                .stream()
                .map(ad -> AdResponse.of(ad, getMedia(ad.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdResponse> findByUserId(Long userId) {
        return adRepository.findByUserId(userId)
                .stream()
                .map(ad -> AdResponse.of(ad, getMedia(ad.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public AdResponse findById(Long id) {
        var ad = adRepository.findByIdWithCampaign(id)
                .orElseThrow(() -> new IllegalArgumentException("Anuncio no encontrado: " + id));
        return AdResponse.of(ad, getMedia(id));
    }

    @Transactional
    public AdResponse create(CreateAdRequest request) {
        var campaign = campaignRepository.findById(request.campaignId())
                .orElseThrow(() -> new IllegalArgumentException("Campaña no encontrada: " + request.campaignId()));

        var ad = Ad.builder()
                .campaign(campaign)
                .title(request.title())
                .description(request.description())
                .status(Ad.Status.DRAFT)
                .build();

        ad = adRepository.save(ad);
        return AdResponse.of(ad, List.of());
    }

    @Transactional
    public AdResponse update(Long id, UpdateAdRequest request) {
        var ad = adRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Anuncio no encontrado: " + id));

        if (request.title() != null) ad.setTitle(request.title());
        if (request.description() != null) ad.setDescription(request.description());
        if (request.status() != null) ad.setStatus(Ad.Status.valueOf(request.status()));

        ad = adRepository.save(ad);
        return AdResponse.of(ad, getMedia(id));
    }

    @Transactional
    public AdResponse uploadMedia(Long adId, List<MultipartFile> files) {
        var ad = adRepository.findById(adId)
                .orElseThrow(() -> new IllegalArgumentException("Anuncio no encontrado: " + adId));

        for (var file : files) {
            validateFile(file);
            var url = storageService.store(file, "ads/" + adId);
            var mediaType = file.getContentType() != null && file.getContentType().startsWith("video")
                    ? com.generadorpublicidad.media.model.Media.MediaType.VIDEO
                    : com.generadorpublicidad.media.model.Media.MediaType.IMAGE;

            var media = com.generadorpublicidad.media.model.Media.builder()
                    .ad(ad)
                    .filename(url.substring(url.lastIndexOf("/") + 1))
                    .originalName(file.getOriginalFilename() != null ? file.getOriginalFilename() : "unknown")
                    .contentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
                    .size(file.getSize())
                    .mediaType(mediaType)
                    .url(url)
                    .build();

            mediaRepository.save(media);
        }

        return AdResponse.of(ad, getMedia(adId));
    }

    @Transactional
    public void deleteMedia(Long mediaId) {
        var media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new IllegalArgumentException("Media no encontrado: " + mediaId));
        storageService.delete(media.getUrl());
        mediaRepository.delete(media);
    }

    public GeneratedCopy generateCopy(GenerateCopyRequest request) {
        return aiClient.generateCopy(request);
    }

    @Transactional
    public void delete(Long id) {
        var mediaList = mediaRepository.findByAdIdOrderByCreatedAtAsc(id);
        for (var media : mediaList) {
            storageService.delete(media.getUrl());
        }
        mediaRepository.deleteByAdId(id);
        adRepository.deleteById(id);
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "El archivo excede el tamaño máximo de " + (MAX_FILE_SIZE / (1024 * 1024)) + " MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException(
                    "Tipo de archivo no permitido: " + contentType + ". Permisos: " + ALLOWED_CONTENT_TYPES);
        }
    }

    private List<MediaResponse> getMedia(Long adId) {
        return mediaRepository.findByAdIdOrderByCreatedAtAsc(adId)
                .stream()
                .map(MediaResponse::of)
                .toList();
    }
}
