package com.eum.folderservice.domain.savedFile.repository;

import com.eum.folderservice.domain.savedFile.entity.SavedFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavedFileRepository extends JpaRepository<SavedFile, Long> {
}
