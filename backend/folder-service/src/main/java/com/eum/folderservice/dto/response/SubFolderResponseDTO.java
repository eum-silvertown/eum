package com.eum.folderservice.dto.response;

import com.eum.folderservice.domain.Folder;
import lombok.Builder;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
public class SubFolderResponseDTO {
    private Long folderId;
    private List<FolderResponseDTO> subFolders;
    private List<SavedFileResponseDTO> subFiles;

    public static SubFolderResponseDTO of(Folder folder) {
        List<FolderResponseDTO> subFolders = new ArrayList<>();
        List<SavedFileResponseDTO> subFiles = new ArrayList<>();

        if (folder.getSubFolders() != null) {
            subFolders = folder.getSubFolders().stream().map(FolderResponseDTO::of).toList();
        }
        if(folder.getSavedFiles() != null) {
            subFiles = folder.getSavedFiles().stream().map(SavedFileResponseDTO::of).toList();
        }

        return SubFolderResponseDTO.builder()
                .folderId(folder.getId())
                .subFolders(subFolders)
                .subFiles(subFiles)
                .build();
    }
}
