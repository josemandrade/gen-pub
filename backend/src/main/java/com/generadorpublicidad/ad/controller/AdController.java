package com.generadorpublicidad.ad.controller;

import com.generadorpublicidad.ad.dto.*;
import com.generadorpublicidad.ad.service.AdService;
import com.generadorpublicidad.ai.GeneratedCopy;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/ads")
@RequiredArgsConstructor
public class AdController {

    private final AdService adService;

    @GetMapping
    public ResponseEntity<List<AdResponse>> list(@RequestParam Long campaignId) {
        return ResponseEntity.ok(adService.findByCampaignId(campaignId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AdResponse>> listMy(org.springframework.security.core.Authentication auth) {
        var user = (com.generadorpublicidad.auth.model.User) auth.getPrincipal();
        return ResponseEntity.ok(adService.findByUserId(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(adService.findById(id));
    }

    @PostMapping
    public ResponseEntity<AdResponse> create(@Valid @RequestBody CreateAdRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdResponse> update(@PathVariable Long id, @Valid @RequestBody UpdateAdRequest request) {
        return ResponseEntity.ok(adService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        adService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/media")
    public ResponseEntity<AdResponse> uploadMedia(@PathVariable Long id, @RequestParam List<MultipartFile> files) {
        return ResponseEntity.ok(adService.uploadMedia(id, files));
    }

    @DeleteMapping("/media/{mediaId}")
    public ResponseEntity<Void> deleteMedia(@PathVariable Long mediaId) {
        adService.deleteMedia(mediaId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/generate-copy")
    public ResponseEntity<GeneratedCopy> generateCopy(@Valid @RequestBody GenerateCopyRequest request) {
        return ResponseEntity.ok(adService.generateCopy(request));
    }
}
