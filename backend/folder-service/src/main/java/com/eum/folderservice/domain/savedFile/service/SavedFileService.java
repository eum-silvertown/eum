package com.eum.folderservice.domain.savedFile.service;

import com.eum.folderservice.domain.savedFile.dto.response.SavedFileDetailResponseDTO;

public interface SavedFileService {

    SavedFileDetailResponseDTO getSavedFileDetail(Long fileId);

}
