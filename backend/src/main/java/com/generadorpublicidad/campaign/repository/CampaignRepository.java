package com.generadorpublicidad.campaign.repository;

import com.generadorpublicidad.campaign.model.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByUserIdOrderByCreatedAtDesc(Long userId);
}
