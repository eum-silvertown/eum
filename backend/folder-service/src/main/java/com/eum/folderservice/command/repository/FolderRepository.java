package com.eum.folderservice.command.repository;

import com.eum.folderservice.command.domain.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FolderRepository extends JpaRepository<Folder, Long> {
}
