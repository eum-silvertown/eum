package com.eum.folderservice.command.service;

import com.eum.folderservice.command.domain.Folder;
import com.eum.folderservice.command.dto.CreateFolderRequestDTO;
import com.eum.folderservice.command.repository.FolderRepository;
import com.eum.folderservice.common.exception.ErrorCode;
import com.eum.folderservice.common.exception.FolderException;
import com.eum.folderservice.query.dto.CreateFolderResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FolderCommandServiceImpl implements FolderCommandService {

    private final FolderRepository folderRepository;

    @Override
    @Transactional
    public CreateFolderResponseDTO createFolder(CreateFolderRequestDTO createFolderDTO) {
        Folder folder = null;

        // 최상위 폴더인 경우
        if (createFolderDTO.getParentId() == 0) {
            folder = createFolderDTO.from(null);
        }
        // 상위 폴더가 존재하는 경우
        else {
            Folder parentFolder = folderRepository.findById(createFolderDTO.getParentId())
                    .orElseThrow(() -> new FolderException(ErrorCode.FOLDER_NOT_FOUND_ERROR));

            for(Folder subFolder : parentFolder.getSubFolders()) {
                if(subFolder.getTitle().equals(createFolderDTO.getTitle())) {
                    throw new FolderException(ErrorCode.FOLDER_ALREADY_EXISTS_ERROR);
                }
            }

            folder = createFolderDTO.from(parentFolder);
            parentFolder.addChildFolder(folder);
        }

        Folder savedFolder = folderRepository.save(folder);
        return CreateFolderResponseDTO.of(savedFolder);
    }
}
