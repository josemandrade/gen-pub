package com.generadorpublicidad.ad;

import com.generadorpublicidad.ad.dto.CreateAdRequest;
import com.generadorpublicidad.ad.dto.UpdateAdRequest;
import com.generadorpublicidad.ad.model.Ad;
import com.generadorpublicidad.ad.repository.AdRepository;
import com.generadorpublicidad.ad.service.AdService;
import com.generadorpublicidad.ai.AIClient;
import com.generadorpublicidad.ai.GeneratedCopy;
import com.generadorpublicidad.campaign.model.Campaign;
import com.generadorpublicidad.campaign.repository.CampaignRepository;
import com.generadorpublicidad.media.dto.MediaResponse;
import com.generadorpublicidad.media.model.Media;
import com.generadorpublicidad.media.repository.MediaRepository;
import com.generadorpublicidad.storage.StorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdServiceTest {

    @Mock
    private AdRepository adRepository;

    @Mock
    private CampaignRepository campaignRepository;

    @Mock
    private MediaRepository mediaRepository;

    @Mock
    private StorageService storageService;

    @Mock
    private AIClient aiClient;

    @Captor
    private ArgumentCaptor<Ad> adCaptor;

    @Captor
    private ArgumentCaptor<Media> mediaCaptor;

    private AdService adService;

    private Campaign createCampaign() {
        var c = new Campaign();
        c.setId(1L);
        c.setName("Test Campaign");
        return c;
    }

    private Ad createAd(Long id, Campaign campaign) {
        var ad = Ad.builder()
                .id(id)
                .campaign(campaign)
                .title("Test Ad")
                .description("Test description")
                .status(Ad.Status.DRAFT)
                .build();
        return ad;
    }

    @Test
    void create_savesAndReturnsAd() {
        adService = new AdService(adRepository, campaignRepository, mediaRepository, storageService, aiClient);

        var campaign = createCampaign();
        var request = new CreateAdRequest(1L, "New Ad", "Description");

        when(campaignRepository.findById(1L)).thenReturn(Optional.of(campaign));
        when(adRepository.save(any())).thenAnswer(inv -> {
            var ad = inv.<Ad>getArgument(0);
            var field = Ad.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(ad, 10L);
            return ad;
        });

        var response = adService.create(request);

        assertEquals(10L, response.id());
        assertEquals("New Ad", response.title());
        assertEquals("Description", response.description());
        assertEquals(Ad.Status.DRAFT, response.status());
        verify(adRepository).save(any());
    }

    @Test
    void findByUserId_returnsAds() {
        adService = new AdService(adRepository, campaignRepository, mediaRepository, storageService, aiClient);

        var campaign = createCampaign();
        var ad1 = createAd(1L, campaign);
        var ad2 = createAd(2L, campaign);

        when(adRepository.findByUserId(1L)).thenReturn(List.of(ad1, ad2));
        when(mediaRepository.findByAdIdOrderByCreatedAtAsc(anyLong())).thenReturn(List.of());

        var result = adService.findByUserId(1L);

        assertEquals(2, result.size());
        assertEquals("Test Ad", result.get(0).title());
    }

    @Test
    void update_modifiesAdFields() {
        adService = new AdService(adRepository, campaignRepository, mediaRepository, storageService, aiClient);

        var campaign = createCampaign();
        var ad = createAd(1L, campaign);
        var updateRequest = new UpdateAdRequest("Updated Title", "Updated desc", "GENERATED");

        when(adRepository.findById(1L)).thenReturn(Optional.of(ad));
        when(adRepository.save(any())).thenAnswer(inv -> inv.<Ad>getArgument(0));
        when(mediaRepository.findByAdIdOrderByCreatedAtAsc(1L)).thenReturn(List.of());

        var result = adService.update(1L, updateRequest);

        assertEquals("Updated Title", result.title());
        assertEquals("Updated desc", result.description());
        assertEquals(Ad.Status.GENERATED, result.status());
    }

    @Test
    void uploadMedia_savesFilesAndCreatesMedia() {
        adService = new AdService(adRepository, campaignRepository, mediaRepository, storageService, aiClient);

        var campaign = createCampaign();
        var ad = createAd(1L, campaign);
        var file = mock(MultipartFile.class);

        when(adRepository.findById(1L)).thenReturn(Optional.of(ad));
        when(storageService.store(any(), anyString())).thenReturn("/uploads/ads/1/file.jpg");
        when(file.getContentType()).thenReturn("image/jpeg");
        when(file.getOriginalFilename()).thenReturn("photo.jpg");
        when(file.getSize()).thenReturn(1024L);
        when(mediaRepository.save(any())).thenAnswer(inv -> inv.<Media>getArgument(0));
        when(mediaRepository.findByAdIdOrderByCreatedAtAsc(1L)).thenReturn(List.of());

        var result = adService.uploadMedia(1L, List.of(file));

        assertNotNull(result);
        verify(storageService).store(file, "ads/1");
        verify(mediaRepository).save(any());
    }

    @Test
    void delete_removesAdAndMediaAndFiles() {
        adService = new AdService(adRepository, campaignRepository, mediaRepository, storageService, aiClient);

        var campaign = createCampaign();
        var ad = createAd(1L, campaign);
        var mediaItem = Media.builder()
                .id(1L)
                .ad(ad)
                .url("/uploads/ads/1/file.jpg")
                .build();

        when(mediaRepository.findByAdIdOrderByCreatedAtAsc(1L)).thenReturn(List.of(mediaItem));

        adService.delete(1L);

        verify(storageService).delete("/uploads/ads/1/file.jpg");
        verify(mediaRepository).deleteByAdId(1L);
        verify(adRepository).deleteById(1L);
    }

    @Test
    void generateCopy_delegatesToAiClient() {
        adService = new AdService(adRepository, campaignRepository, mediaRepository, storageService, aiClient);

        var request = new com.generadorpublicidad.ad.dto.GenerateCopyRequest("prompt", List.of());
        var expected = new GeneratedCopy("Title", "Desc", List.of("kw1", "kw2"));

        when(aiClient.generateCopy(request)).thenReturn(expected);

        var result = adService.generateCopy(request);

        assertEquals("Title", result.title());
        assertEquals("Desc", result.description());
        verify(aiClient).generateCopy(request);
    }
}
