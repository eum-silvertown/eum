package com.eum.folderservice.domain.savedFile.service;

import com.eum.folderservice.global.exception.ErrorCode;
import com.eum.folderservice.global.exception.FolderException;
import com.eum.folderservice.domain.savedFile.entity.SavedFile;
import com.eum.folderservice.domain.savedFile.dto.response.SavedFileDetailResponseDTO;
import com.eum.folderservice.domain.savedFile.repository.SavedFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SavedFileServiceImpl implements SavedFileService {

    private final SavedFileRepository savedFileRepository;

    @Override
    @Transactional(readOnly = true)
    public SavedFileDetailResponseDTO getSavedFileDetail(Long fileId) {
        SavedFile savedFile = savedFileRepository.findById(fileId)
                .orElseThrow(() -> new FolderException(ErrorCode.FILE_NOT_FOUND_ERROR));

        return SavedFileDetailResponseDTO.of(savedFile);
    }
}
