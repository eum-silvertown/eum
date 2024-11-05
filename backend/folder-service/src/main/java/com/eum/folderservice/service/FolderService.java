package com.eum.folderservice.service;

import com.eum.folderservice.dto.request.CreateFolderRequestDTO;
import com.eum.folderservice.dto.response.CreateFolderResponseDTO;
import com.eum.folderservice.dto.response.SubFolderResponseDTO;

import java.util.List;

public interface FolderService {

    CreateFolderResponseDTO createFolder(CreateFolderRequestDTO createFolderDTO);

    List<SubFolderResponseDTO> getSubFolders(Long folderId, Long memberId);
}
