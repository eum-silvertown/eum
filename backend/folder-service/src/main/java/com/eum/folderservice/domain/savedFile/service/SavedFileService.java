package com.eum.folderservice.domain.savedFile.service;

import com.eum.folderservice.domain.savedFile.dto.request.SavedFileCreateRequestDTO;
import com.eum.folderservice.domain.savedFile.dto.request.SavedFileModifyRequestDTO;
import com.eum.folderservice.domain.savedFile.dto.request.SavedFileMoveRequestDTO;
import com.eum.folderservice.domain.savedFile.dto.response.SavedFileDetailResponseDTO;

public interface SavedFileService {

    SavedFileDetailResponseDTO getSavedFileDetail(Long fileId);

    SavedFileDetailResponseDTO createSavedFile(SavedFileCreateRequestDTO requestDTO);

    SavedFileDetailResponseDTO modifySavedFile(SavedFileModifyRequestDTO requestDTO);

    void deleteSavedFile(Long fileId);

    void moveFolder(SavedFileMoveRequestDTO requestDTO);
}
