package com.eum.folderservice.service;

import com.eum.folderservice.domain.Folder;
import com.eum.folderservice.domain.SavedFile;
import com.eum.folderservice.dto.request.CreateFolderRequestDTO;
import com.eum.folderservice.dto.request.ModifyTitleRequestDTO;
import com.eum.folderservice.dto.request.MoveFolderRequestDTO;
import com.eum.folderservice.dto.response.FolderResponseDTO;
import com.eum.folderservice.dto.response.SavedFileResponseDTO;
import com.eum.folderservice.dto.response.SubFolderResponseDTO;
import com.eum.folderservice.repository.FolderRepository;
import com.eum.folderservice.common.exception.ErrorCode;
import com.eum.folderservice.common.exception.FolderException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FolderServiceImpl implements FolderService {

    private final FolderRepository folderRepository;

    @Override
    @Transactional
    public FolderResponseDTO createFolder(CreateFolderRequestDTO createFolderDTO) {
        Folder newFolder = null;
        Folder parentFolder = findFolderByIdAndMemberId(createFolderDTO.getParentId(), createFolderDTO.getMemberId());

        // 중복된 폴더명이 있는지 확인
        if (isDuplicateFolderName(parentFolder, createFolderDTO.getTitle())) {
            throw new FolderException(ErrorCode.FOLDER_ALREADY_EXISTS_ERROR);
        }

        newFolder = createFolderDTO.from(parentFolder);
        Folder savedFolder = folderRepository.save(newFolder);
        parentFolder.addChildFolder(newFolder);

        return FolderResponseDTO.of(savedFolder);
    }

    @Override
    public void createRootFolder(Long memberId) {
        Folder rootFolder = Folder.builder()
                .memberId(memberId)
                .title("root")
                .childrenCount(0L)
                .parentFolder(null)
                .build();
        folderRepository.save(rootFolder);
    }

    @Override
    @Transactional(readOnly = true)
    public SubFolderResponseDTO getRootFolder(Long memberId) {
        Folder rootFolder = folderRepository.findByMemberIdAndParentFolderIsNull(memberId)
                .orElseThrow(() -> new FolderException(ErrorCode.FOLDER_NOT_FOUND_ERROR));

        List<Folder> subFolders = rootFolder.getSubFolders() == null ? new ArrayList<>() : rootFolder.getSubFolders();
        List<SavedFile> subFiles = rootFolder.getSavedFiles() == null ? new ArrayList<>() : rootFolder.getSavedFiles();

        return SubFolderResponseDTO.builder()
                .folderId(rootFolder.getId())
                .subFolders(subFolders.stream().map(FolderResponseDTO::of).toList())
                .subFiles(subFiles.stream().map(SavedFileResponseDTO::of).toList())
                .build();
    }


    @Override
    @Transactional(readOnly = true)
    public SubFolderResponseDTO getSubFolders(Long folderId, Long memberId) {
        Folder folder = findFolderByIdAndMemberId(folderId, memberId);

        List<Folder> subFolders = folder.getSubFolders() == null ? new ArrayList<>() : folder.getSubFolders();
        List<SavedFile> subFiles = folder.getSavedFiles() == null ? new ArrayList<>() : folder.getSavedFiles();

        return SubFolderResponseDTO.builder()
                .folderId(folder.getId())
                .subFolders(subFolders.stream().map(FolderResponseDTO::of).toList())
                .subFiles(subFiles.stream().map(SavedFileResponseDTO::of).toList())
                .build();
    }

    @Override
    @Transactional
    public FolderResponseDTO modifyFolderTitle(ModifyTitleRequestDTO requestDTO, Long memberId) {
        Folder folder = findFolderByIdAndMemberId(requestDTO.getFolderId(), memberId);

        if(isDuplicateFolderName(folder.getParentFolder(), requestDTO.getTitle())) {
            throw new FolderException(ErrorCode.FOLDER_ALREADY_EXISTS_ERROR);
        }

        folder.modifyTitle(requestDTO.getTitle());
        return FolderResponseDTO.of(folder);
    }

    @Override
    @Transactional
    public void deleteFolder(Long folderId, Long memberId) {
        Folder folder = findFolderByIdAndMemberId(folderId, memberId);
        Folder parentFolder = folder.getParentFolder();

        if (parentFolder == null) {
            throw new FolderException(ErrorCode.ROOT_FOLDER_DELETE_ERROR);
        }

        parentFolder.removeChildFolder(folder);
        folderRepository.delete(folder);
    }

    @Override
    @Transactional
    public void moveFolder(MoveFolderRequestDTO requestDTO, Long memberId) {
        Folder folder = findFolderByIdAndMemberId(requestDTO.getFolderId(), memberId);

        if(folder.getParentFolder() == null) {
            throw new FolderException(ErrorCode.ROOT_FOLDER_MOVE_ERROR);
        }

        folder.getParentFolder().removeChildFolder(folder);

        Folder toFolder = findFolderByIdAndMemberId(requestDTO.getToId(), memberId);

        if(isDuplicateFolderName(toFolder, folder.getTitle())) {
            throw new FolderException(ErrorCode.FOLDER_ALREADY_EXISTS_ERROR);
        }

        folder.setParentFolder(toFolder);
        toFolder.addChildFolder(folder);
    }

    @Transactional
    protected Folder findFolderByIdAndMemberId(Long folderId, Long memberId) {
        return folderRepository.findByIdAndMemberId(folderId, memberId)
                .orElseThrow(() -> new FolderException(ErrorCode.FOLDER_NOT_FOUND_ERROR));
    }

    private boolean isDuplicateFolderName(Folder parentFolder, String title) {
        for (Folder subFolder : parentFolder.getSubFolders()) {
            if (subFolder.getTitle().equals(title)) {
                return true;
            }
        }
        return false;
    }
}
