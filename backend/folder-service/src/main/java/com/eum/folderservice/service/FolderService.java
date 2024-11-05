package com.eum.folderservice.service;

import com.eum.folderservice.dto.request.CreateFolderRequestDTO;
import com.eum.folderservice.dto.request.ModifyTitleRequestDTO;
import com.eum.folderservice.dto.response.FolderResponseDTO;
import com.eum.folderservice.dto.response.SubFolderResponseDTO;

import java.util.List;

public interface FolderService {

    FolderResponseDTO createFolder(CreateFolderRequestDTO createFolderDTO);

    List<SubFolderResponseDTO> getSubFolders(Long folderId, Long memberId);

    FolderResponseDTO modifyFolderTitle(ModifyTitleRequestDTO requestDTO, Long memberId);
}
