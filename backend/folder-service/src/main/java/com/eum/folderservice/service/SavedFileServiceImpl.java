package com.eum.folderservice.service;

import com.eum.folderservice.common.exception.ErrorCode;
import com.eum.folderservice.common.exception.FolderException;
import com.eum.folderservice.domain.SavedFile;
import com.eum.folderservice.dto.response.SavedFileDetailResponseDTO;
import com.eum.folderservice.repository.SavedFileRepository;
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
