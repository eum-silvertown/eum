package com.eum.lecture_service.command.repository.folder;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eum.lecture_service.command.entity.folder.Folder;

public interface FolderRepository extends JpaRepository<Folder, Long> {
}
