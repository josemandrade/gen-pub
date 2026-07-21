package com.generadorpublicidad.ad;

import com.generadorpublicidad.ad.dto.CreateAdRequest;
import com.generadorpublicidad.ad.dto.UpdateAdRequest;
import com.generadorpublicidad.ad.model.Ad;
import com.generadorpublicidad.ad.repository.AdRepository;
import com.generadorpublicidad.ad.service.AdService;
import com.generadorpublicidad.ai.AIClient;
import com.generadorpublicidad.ai.GeneratedCopy;
import com.generadorpublicidad.auth.model.User;
import com.generadorpublicidad.campaign.model.Campaign;
import com.generadorpublicidad.campaign.repository.CampaignRepository;
import com.generadorpublicidad.media.dto.MediaResponse;
import com.generadorpublicidad.media.model.Media;
import com.generadorpublicidad.media.repository.MediaRepository;
import com.generadorpublicidad.storage.StorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
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

    @Mock
    private Authentication auth;

    @Captor
    private ArgumentCaptor<Ad> adCaptor;

    @Captor
    private ArgumentCaptor<Media> mediaCaptor;

    private AdService adService;

    private User testUser;
    private User otherUser;

    @BeforeEach
    void setUp() {
        adService = new AdService(adRepository, campaignRepository, mediaRepository, storageService, aiClient);
        testUser = User.builder().id(1L).name("Test").email("test@test.com").password("encoded").role(User.Role.EDITOR).build();
        otherUser = User.builder().id(2L).name("Other").email("other@test.com").password("encoded").role(User.Role.EDITOR).build();
        lenient().when(auth.getPrincipal()).thenReturn(testUser);
    }

    private Campaign createCampaign() {
        var c = new Campaign();
        c.setId(1L);
        c.setName("Test Campaign");
        c.setUser(testUser);
        return c;
    }

    private Ad createAd(Long id, Campaign campaign) {
        return Ad.builder()
                .id(id)
                .campaign(campaign)
                .title("Test Ad")
                .description("Test description")
                .status(Ad.Status.DRAFT)
                .build();
    }

    private Campaign createOtherUsersCampaign() {
        var c = new Campaign();
        c.setId(1L);
        c.setName("Other's Campaign");
        c.setUser(otherUser);
        return c;
    }

    @Test
    void create_savesAndReturnsAd() {
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

        var response = adService.create(request, auth);

        assertEquals(10L, response.id());
        assertEquals("New Ad", response.title());
        assertEquals("Description", response.description());
        assertEquals(Ad.Status.DRAFT, response.status());
        verify(adRepository).save(any());
    }

    @Test
    void findByUserId_returnsAds() {
        var campaign = createCampaign();
        var ad1 = createAd(1L, campaign);
        var ad2 = createAd(2L, campaign);

        when(adRepository.findByUserId(1L)).thenReturn(List.of(ad1, ad2));
        when(mediaRepository.findByAdIdsOrderByCreatedAtAsc(any())).thenReturn(List.of());

        var result = adService.findByUserId(1L);

        assertEquals(2, result.size());
        assertEquals("Test Ad", result.get(0).title());
    }

    @Test
    void update_modifiesAdFields() {
        var campaign = createCampaign();
        var ad = createAd(1L, campaign);
        var updateRequest = new UpdateAdRequest("Updated Title", "Updated desc", "GENERATED");

        when(adRepository.findByIdWithCampaign(1L)).thenReturn(Optional.of(ad));
        when(adRepository.save(any())).thenAnswer(inv -> inv.<Ad>getArgument(0));
        when(mediaRepository.findByAdIdOrderByCreatedAtAsc(1L)).thenReturn(List.of());

        var result = adService.update(1L, updateRequest, auth);

        assertEquals("Updated Title", result.title());
        assertEquals("Updated desc", result.description());
        assertEquals(Ad.Status.GENERATED, result.status());
    }

    @Test
    void uploadMedia_savesFilesAndCreatesMedia() {
        var campaign = createCampaign();
        var ad = createAd(1L, campaign);
        var file = mock(MultipartFile.class);

        when(adRepository.findByIdWithCampaign(1L)).thenReturn(Optional.of(ad));
        when(storageService.store(any(), anyString())).thenReturn("/uploads/ads/1/file.jpg");
        when(file.getContentType()).thenReturn("image/jpeg");
        when(file.getOriginalFilename()).thenReturn("photo.jpg");
        when(file.getSize()).thenReturn(1024L);
        when(mediaRepository.save(any())).thenAnswer(inv -> inv.<Media>getArgument(0));
        when(mediaRepository.findByAdIdOrderByCreatedAtAsc(1L)).thenReturn(List.of());

        var result = adService.uploadMedia(1L, List.of(file), auth);

        assertNotNull(result);
        verify(storageService).store(file, "ads/1");
        verify(mediaRepository).save(any());
    }

    @Test
    void findByCampaignId_returnsAds() {
        var campaign = createCampaign();
        var ad1 = createAd(1L, campaign);

        when(campaignRepository.findById(1L)).thenReturn(Optional.of(campaign));
        when(adRepository.findByCampaignIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(ad1));
        when(mediaRepository.findByAdIdsOrderByCreatedAtAsc(any())).thenReturn(List.of());

        var result = adService.findByCampaignId(1L, auth);

        assertEquals(1, result.size());
        assertEquals("Test Ad", result.get(0).title());
    }

    @Test
    void findById_returnsAd() {
        var campaign = createCampaign();
        var ad = createAd(1L, campaign);

        when(adRepository.findByIdWithCampaign(1L)).thenReturn(Optional.of(ad));
        when(mediaRepository.findByAdIdOrderByCreatedAtAsc(1L)).thenReturn(List.of());

        var result = adService.findById(1L, auth);

        assertEquals("Test Ad", result.title());
    }

    @Test
    void findById_throwsWhenNotFound() {
        when(adRepository.findByIdWithCampaign(99L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> adService.findById(99L, auth));
    }

    @Test
    void create_throwsWhenCampaignNotFound() {
        var request = new CreateAdRequest(99L, "Ad", "Desc");
        when(campaignRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> adService.create(request, auth));
    }

    @Test
    void update_throwsWhenAdNotFound() {
        when(adRepository.findByIdWithCampaign(99L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> adService.update(99L, new UpdateAdRequest("T", "D", null), auth));
    }

    @Test
    void deleteMedia_removesMediaAndFile() {
        var campaign = createCampaign();
        var ad = createAd(1L, campaign);
        var media = Media.builder()
                .id(1L).ad(ad).url("/uploads/test.jpg").build();
        when(mediaRepository.findById(1L)).thenReturn(Optional.of(media));
        when(adRepository.findByIdWithCampaign(1L)).thenReturn(Optional.of(ad));

        adService.deleteMedia(1L, auth);

        verify(storageService).delete("/uploads/test.jpg");
        verify(mediaRepository).delete(media);
    }

    @Test
    void deleteMedia_throwsWhenNotFound() {
        when(mediaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> adService.deleteMedia(99L, auth));
    }

    @Test
    void uploadMedia_rejectsEmptyFile() {
        var campaign = createCampaign();
        var ad = createAd(1L, campaign);
        var file = mock(MultipartFile.class);

        when(adRepository.findByIdWithCampaign(1L)).thenReturn(Optional.of(ad));
        when(file.isEmpty()).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> adService.uploadMedia(1L, List.of(file), auth));
    }

    @Test
    void uploadMedia_rejectsInvalidContentType() {
        var campaign = createCampaign();
        var ad = createAd(1L, campaign);
        var file = mock(MultipartFile.class);

        when(adRepository.findByIdWithCampaign(1L)).thenReturn(Optional.of(ad));
        when(file.isEmpty()).thenReturn(false);
        when(file.getContentType()).thenReturn("application/exe");
        when(file.getSize()).thenReturn(100L);

        assertThrows(IllegalArgumentException.class, () -> adService.uploadMedia(1L, List.of(file), auth));
    }

    @Test
    void delete_removesAdAndMediaAndFiles() {
        var campaign = createCampaign();
        var ad = createAd(1L, campaign);
        var mediaItem = Media.builder()
                .id(1L)
                .ad(ad)
                .url("/uploads/ads/1/file.jpg")
                .build();

        when(adRepository.findByIdWithCampaign(1L)).thenReturn(Optional.of(ad));
        when(mediaRepository.findByAdIdOrderByCreatedAtAsc(1L)).thenReturn(List.of(mediaItem));

        adService.delete(1L, auth);

        verify(storageService).delete("/uploads/ads/1/file.jpg");
        verify(mediaRepository).deleteByAdId(1L);
        verify(adRepository).deleteById(1L);
    }

    @Test
    void generateCopy_delegatesToAiClient() {
        var request = new com.generadorpublicidad.ad.dto.GenerateCopyRequest("prompt", List.of());
        var expected = new GeneratedCopy("Title", "Desc", List.of("kw1", "kw2"));

        when(aiClient.generateCopy(request)).thenReturn(expected);

        var result = adService.generateCopy(request);

        assertEquals("Title", result.title());
        assertEquals("Desc", result.description());
        verify(aiClient).generateCopy(request);
    }

    @Test
    void findByCampaignId_throwsWhenCampaignBelongsToOtherUser() {
        var otherCampaign = createOtherUsersCampaign();
        when(campaignRepository.findById(1L)).thenReturn(Optional.of(otherCampaign));

        assertThrows(IllegalArgumentException.class, () -> adService.findByCampaignId(1L, auth));
    }

    @Test
    void findById_throwsWhenAdBelongsToOtherUser() {
        var otherCampaign = createOtherUsersCampaign();
        var otherAd = createAd(1L, otherCampaign);

        when(adRepository.findByIdWithCampaign(1L)).thenReturn(Optional.of(otherAd));

        assertThrows(IllegalArgumentException.class, () -> adService.findById(1L, auth));
    }

    @Test
    void update_throwsWhenAdBelongsToOtherUser() {
        var otherCampaign = createOtherUsersCampaign();
        var otherAd = createAd(1L, otherCampaign);

        when(adRepository.findByIdWithCampaign(1L)).thenReturn(Optional.of(otherAd));

        assertThrows(IllegalArgumentException.class,
                () -> adService.update(1L, new UpdateAdRequest("T", "D", null), auth));
    }

    @Test
    void delete_throwsWhenAdBelongsToOtherUser() {
        var otherCampaign = createOtherUsersCampaign();
        var otherAd = createAd(1L, otherCampaign);

        when(adRepository.findByIdWithCampaign(1L)).thenReturn(Optional.of(otherAd));

        assertThrows(IllegalArgumentException.class, () -> adService.delete(1L, auth));
    }

    @Test
    void uploadMedia_throwsWhenAdBelongsToOtherUser() {
        var otherCampaign = createOtherUsersCampaign();
        var otherAd = createAd(1L, otherCampaign);
        var file = mock(MultipartFile.class);

        when(adRepository.findByIdWithCampaign(1L)).thenReturn(Optional.of(otherAd));

        assertThrows(IllegalArgumentException.class, () -> adService.uploadMedia(1L, List.of(file), auth));
    }

    @Test
    void deleteMedia_throwsWhenMediaAdBelongsToOtherUser() {
        var otherCampaign = createOtherUsersCampaign();
        var otherAd = createAd(2L, otherCampaign);
        var media = Media.builder().id(1L).ad(otherAd).url("/uploads/test.jpg").build();

        when(mediaRepository.findById(1L)).thenReturn(Optional.of(media));
        when(adRepository.findByIdWithCampaign(2L)).thenReturn(Optional.of(otherAd));

        assertThrows(IllegalArgumentException.class, () -> adService.deleteMedia(1L, auth));
    }

    @Test
    void create_throwsWhenCampaignBelongsToOtherUser() {
        var otherCampaign = createOtherUsersCampaign();
        var request = new CreateAdRequest(1L, "Ad", "Desc");

        when(campaignRepository.findById(1L)).thenReturn(Optional.of(otherCampaign));

        assertThrows(IllegalArgumentException.class, () -> adService.create(request, auth));
    }

    @Test
    void uploadMedia_rejectsOversizedFile() {
        var campaign = createCampaign();
        var ad = createAd(1L, campaign);
        var file = mock(MultipartFile.class);

        when(adRepository.findByIdWithCampaign(1L)).thenReturn(Optional.of(ad));
        when(file.isEmpty()).thenReturn(false);
        when(file.getSize()).thenReturn(60L * 1024 * 1024);

        assertThrows(IllegalArgumentException.class, () -> adService.uploadMedia(1L, List.of(file), auth));
    }

    @Test
    void update_throwsWhenInvalidStatus() {
        var campaign = createCampaign();
        var ad = createAd(1L, campaign);

        when(adRepository.findByIdWithCampaign(1L)).thenReturn(Optional.of(ad));

        var request = new UpdateAdRequest("T", "D", "ESTADO_FALSO");
        var ex = assertThrows(IllegalArgumentException.class, () -> adService.update(1L, request, auth));
        assertTrue(ex.getMessage().contains("Estado inválido"));
    }
}
