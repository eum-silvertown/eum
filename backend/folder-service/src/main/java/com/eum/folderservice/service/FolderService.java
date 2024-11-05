package com.eum.folderservice.service;

import com.eum.folderservice.dto.CreateFolderRequestDTO;
import com.eum.folderservice.dto.response.CreateFolderResponseDTO;

public interface FolderService {

    CreateFolderResponseDTO createFolder(CreateFolderRequestDTO createFolderDTO);
}
