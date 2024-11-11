package com.eum.folderservice.domain.folder.repository;

import com.eum.folderservice.domain.folder.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FolderRepository extends JpaRepository<Folder, Long> {

    Optional<Folder> findByIdAndMemberId(Long id, Long memberId);

    Optional<Folder> findByMemberIdAndParentFolderIsNull(Long memberId);
}
