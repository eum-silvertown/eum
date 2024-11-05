package com.eum.folderservice.repository;

import com.eum.folderservice.domain.SavedFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavedFileRepository extends JpaRepository<SavedFile, Long> {
}
