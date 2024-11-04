package com.eum.folderservice.command.service;

import com.eum.folderservice.command.dto.CreateFolderRequestDTO;
import com.eum.folderservice.query.dto.CreateFolderResponseDTO;

public interface FolderCommandService {

    CreateFolderResponseDTO createFolder(CreateFolderRequestDTO createFolderDTO);
}
