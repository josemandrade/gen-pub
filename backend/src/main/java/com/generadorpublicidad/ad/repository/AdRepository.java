package com.generadorpublicidad.ad.repository;

import com.generadorpublicidad.ad.model.Ad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AdRepository extends JpaRepository<Ad, Long> {
    @Query("SELECT a FROM Ad a JOIN FETCH a.campaign WHERE a.campaign.id = :campaignId ORDER BY a.createdAt DESC")
    List<Ad> findByCampaignIdOrderByCreatedAtDesc(@Param("campaignId") Long campaignId);

    @Query("SELECT a FROM Ad a JOIN FETCH a.campaign JOIN a.campaign.user u WHERE u.id = :userId ORDER BY a.createdAt DESC")
    List<Ad> findByUserId(@Param("userId") Long userId);

    @Query("SELECT a FROM Ad a JOIN FETCH a.campaign WHERE a.id = :id")
    java.util.Optional<Ad> findByIdWithCampaign(@Param("id") Long id);
}
