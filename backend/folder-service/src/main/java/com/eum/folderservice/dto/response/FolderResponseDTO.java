package com.eum.folderservice.dto.response;

import com.eum.folderservice.domain.Folder;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FolderResponseDTO {
    private Long folderId;
    private String title;
    private Long childrenCount;

    public static FolderResponseDTO of(Folder folder) {
        return FolderResponseDTO.builder()
                .folderId(folder.getId())
                .title(folder.getTitle())
                .childrenCount(folder.getChildrenCount())
                .build();
    }
}
