package com.generadorpublicidad.media.repository;

import com.generadorpublicidad.media.model.Media;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findByAdIdOrderByCreatedAtAsc(Long adId);

    void deleteByAdId(Long adId);
}
