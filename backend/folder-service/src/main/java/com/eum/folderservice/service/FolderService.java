package com.eum.folderservice.service;

import com.eum.folderservice.dto.request.CreateFolderRequestDTO;
import com.eum.folderservice.dto.request.ModifyTitleRequestDTO;
import com.eum.folderservice.dto.request.MoveFolderRequestDTO;
import com.eum.folderservice.dto.response.FolderResponseDTO;
import com.eum.folderservice.dto.response.SubFolderResponseDTO;

public interface FolderService {

    FolderResponseDTO createFolder(CreateFolderRequestDTO createFolderDTO);

    SubFolderResponseDTO getRootFolder(Long memberId);

    SubFolderResponseDTO getSubFolders(Long folderId, Long memberId);

    FolderResponseDTO modifyFolderTitle(ModifyTitleRequestDTO requestDTO, Long memberId);

    void deleteFolder(Long folderId, Long memberId);

    void moveFolder(MoveFolderRequestDTO requestDTO, Long memberId);
}
