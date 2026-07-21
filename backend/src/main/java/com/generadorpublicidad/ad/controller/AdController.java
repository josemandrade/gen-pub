package com.generadorpublicidad.ad.controller;

import com.generadorpublicidad.ad.dto.*;
import com.generadorpublicidad.ad.service.AdService;
import com.generadorpublicidad.ai.GeneratedCopy;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/ads")
@RequiredArgsConstructor
public class AdController {

    private final AdService adService;

    @GetMapping
    public ResponseEntity<List<AdResponse>> list(@RequestParam Long campaignId, Authentication auth) {
        return ResponseEntity.ok(adService.findByCampaignId(campaignId, auth));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AdResponse>> listMy(Authentication auth) {
        var user = (com.generadorpublicidad.auth.model.User) auth.getPrincipal();
        return ResponseEntity.ok(adService.findByUserId(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdResponse> get(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(adService.findById(id, auth));
    }

    @PostMapping
    public ResponseEntity<AdResponse> create(@Valid @RequestBody CreateAdRequest request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adService.create(request, auth));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdResponse> update(@PathVariable Long id, @Valid @RequestBody UpdateAdRequest request, Authentication auth) {
        return ResponseEntity.ok(adService.update(id, request, auth));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        adService.delete(id, auth);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/media")
    public ResponseEntity<AdResponse> uploadMedia(@PathVariable Long id, @RequestParam List<MultipartFile> files, Authentication auth) {
        return ResponseEntity.ok(adService.uploadMedia(id, files, auth));
    }

    @DeleteMapping("/media/{mediaId}")
    public ResponseEntity<Void> deleteMedia(@PathVariable Long mediaId, Authentication auth) {
        adService.deleteMedia(mediaId, auth);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/generate-copy")
    public ResponseEntity<GeneratedCopy> generateCopy(@Valid @RequestBody GenerateCopyRequest request) {
        return ResponseEntity.ok(adService.generateCopy(request));
    }
}
