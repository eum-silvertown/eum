package com.eum.folderservice.query.dto;

import com.eum.folderservice.command.domain.Folder;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateFolderResponseDTO {
    private Long folderId;
    private String title;
    private Long childrenCount;

    public static CreateFolderResponseDTO of(Folder folder) {
        return CreateFolderResponseDTO.builder()
                .folderId(folder.getId())
                .title(folder.getTitle())
                .childrenCount(folder.getChildrenCount())
                .build();
    }
}
