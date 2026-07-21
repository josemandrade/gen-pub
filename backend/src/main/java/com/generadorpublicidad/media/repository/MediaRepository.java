package com.generadorpublicidad.media.repository;

import com.generadorpublicidad.media.model.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findByAdIdOrderByCreatedAtAsc(Long adId);

    @Query("SELECT m FROM Media m WHERE m.ad.id IN :adIds ORDER BY m.createdAt ASC")
    List<Media> findByAdIdsOrderByCreatedAtAsc(@Param("adIds") List<Long> adIds);

    void deleteByAdId(Long adId);
}
