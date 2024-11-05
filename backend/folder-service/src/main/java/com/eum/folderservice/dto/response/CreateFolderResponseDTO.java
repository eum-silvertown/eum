package com.eum.folderservice.dto.response;

import com.eum.folderservice.domain.Folder;
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
