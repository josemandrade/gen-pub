package com.generadorpublicidad.campaign.controller;

import com.generadorpublicidad.campaign.dto.CampaignResponse;
import com.generadorpublicidad.campaign.dto.CreateCampaignRequest;
import com.generadorpublicidad.campaign.service.CampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @GetMapping
    public ResponseEntity<List<CampaignResponse>> list(Authentication auth) {
        return ResponseEntity.ok(campaignService.findByCurrentUser(auth));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampaignResponse> get(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(campaignService.findById(id, auth));
    }

    @PostMapping
    public ResponseEntity<CampaignResponse> create(@Valid @RequestBody CreateCampaignRequest request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(campaignService.create(request.name(), request.description(), auth));
    }
}
