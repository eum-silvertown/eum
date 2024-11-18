package com.eum.folderservice.domain.folder.service;

import com.eum.folderservice.domain.folder.dto.request.CreateFolderRequestDTO;
import com.eum.folderservice.domain.folder.dto.request.ModifyTitleRequestDTO;
import com.eum.folderservice.domain.folder.dto.request.MoveFolderRequestDTO;
import com.eum.folderservice.domain.folder.dto.response.FolderResponseDTO;
import com.eum.folderservice.domain.folder.dto.response.SubFolderResponseDTO;

public interface FolderService {

    FolderResponseDTO createFolder(CreateFolderRequestDTO createFolderDTO);

    void createRootFolder(Long memberId);

    SubFolderResponseDTO getRootFolder(Long memberId);

    SubFolderResponseDTO getSubFolders(Long folderId, Long memberId);

    FolderResponseDTO modifyFolderTitle(ModifyTitleRequestDTO requestDTO, Long memberId);

    void deleteFolder(Long folderId, Long memberId);

    void moveFolder(MoveFolderRequestDTO requestDTO, Long memberId);
}
