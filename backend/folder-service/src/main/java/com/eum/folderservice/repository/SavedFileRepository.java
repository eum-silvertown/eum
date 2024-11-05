package com.eum.folderservice.repository;

import com.eum.folderservice.domain.SavedFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavedFileRepository extends JpaRepository<SavedFile, Long> {

//    List<SavedFile> findAllBy
}
