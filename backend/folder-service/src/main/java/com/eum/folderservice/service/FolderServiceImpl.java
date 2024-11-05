package com.eum.folderservice.service;

import com.eum.folderservice.domain.Folder;
import com.eum.folderservice.dto.CreateFolderRequestDTO;
import com.eum.folderservice.dto.response.CreateFolderResponseDTO;
import com.eum.folderservice.repository.FolderRepository;
import com.eum.folderservice.common.exception.ErrorCode;
import com.eum.folderservice.common.exception.FolderException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class FolderServiceImpl implements FolderService {

    private final FolderRepository folderRepository;

    @Override
    @Transactional
    public CreateFolderResponseDTO createFolder(CreateFolderRequestDTO createFolderDTO) {
        Folder newFolder = null;

        // 최상위 폴더인 경우
        if (createFolderDTO.getParentId() == 0) {
            newFolder = createFolderDTO.from(null);
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

            newFolder = createFolderDTO.from(parentFolder);
            parentFolder.addChildFolder(newFolder);
        }

        Folder savedFolder = folderRepository.save(newFolder);

        return CreateFolderResponseDTO.of(savedFolder);
    }
}
