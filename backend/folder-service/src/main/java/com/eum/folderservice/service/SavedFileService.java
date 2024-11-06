package com.eum.folderservice.service;

import com.eum.folderservice.dto.response.SavedFileDetailResponseDTO;

public interface SavedFileService {

    SavedFileDetailResponseDTO getSavedFileDetail(Long fileId);

}
