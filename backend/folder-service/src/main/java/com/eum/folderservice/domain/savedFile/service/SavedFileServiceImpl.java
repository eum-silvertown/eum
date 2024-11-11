package com.eum.folderservice.domain.savedFile.service;

import com.eum.folderservice.domain.folder.entity.Folder;
import com.eum.folderservice.domain.folder.repository.FolderRepository;
import com.eum.folderservice.domain.savedFile.dto.request.SavedFileCreateRequestDTO;
import com.eum.folderservice.domain.savedFile.dto.request.SavedFileModifyRequestDTO;
import com.eum.folderservice.domain.savedFile.dto.request.SavedFileMoveRequestDTO;
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

    private final FolderRepository folderRepository;
    private final SavedFileRepository savedFileRepository;

    @Override
    @Transactional(readOnly = true)
    public SavedFileDetailResponseDTO getSavedFileDetail(Long fileId) {
        SavedFile savedFile = savedFileRepository.findById(fileId)
                .orElseThrow(() -> new FolderException(ErrorCode.FILE_NOT_FOUND_ERROR));

        return SavedFileDetailResponseDTO.of(savedFile);
    }

    @Override
    @Transactional
    public SavedFileDetailResponseDTO createSavedFile(SavedFileCreateRequestDTO requestDTO) {
        Folder parentFolder = folderRepository.findById(requestDTO.getFolderId())
                .orElseThrow(() -> new FolderException(ErrorCode.FOLDER_NOT_FOUND_ERROR));

        SavedFile file = requestDTO.from(parentFolder);

        SavedFile savedFile = savedFileRepository.save(file);
        parentFolder.addSavedFile(savedFile);

        return SavedFileDetailResponseDTO.of(savedFile);
    }

    @Override
    @Transactional
    public SavedFileDetailResponseDTO modifySavedFile(SavedFileModifyRequestDTO requestDTO) {
        SavedFile savedFile = savedFileRepository.findById(requestDTO.getFileId())
                .orElseThrow(() -> new FolderException(ErrorCode.FILE_NOT_FOUND_ERROR));

        savedFile.update(requestDTO.getTitle(), requestDTO.getContent(), requestDTO.getAnswer());
        return SavedFileDetailResponseDTO.of(savedFile);
    }

    @Override
    @Transactional
    public void deleteSavedFile(Long fileId) {
        SavedFile savedFile = savedFileRepository.findById(fileId)
                .orElseThrow(() -> new FolderException(ErrorCode.FILE_NOT_FOUND_ERROR));

        Folder parentFolder = savedFile.getFolder();
        parentFolder.removeSavedFile(savedFile);

        savedFileRepository.delete(savedFile);
    }

    @Override
    @Transactional
    public void moveFolder(SavedFileMoveRequestDTO requestDTO) {
        SavedFile savedFile = savedFileRepository.findById(requestDTO.getFileId())
                .orElseThrow(() -> new FolderException(ErrorCode.FILE_NOT_FOUND_ERROR));

        Folder currentParentFolder = savedFile.getFolder();
        currentParentFolder.removeSavedFile(savedFile);

        Folder newParentFolder = folderRepository.findById(requestDTO.getToId())
                .orElseThrow(() -> new FolderException(ErrorCode.FOLDER_NOT_FOUND_ERROR));
        newParentFolder.addSavedFile(savedFile);

        savedFile.moveFolder(newParentFolder);
    }
}
