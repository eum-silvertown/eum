package com.eum.folderservice.domain.folder.dto.response;

import com.eum.folderservice.domain.folder.entity.Folder;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FolderResponseDTO {
    private Long folderId;
    private Long parentId;
    private String title;
    private Long childrenCount;

    public static FolderResponseDTO of(Folder folder) {
        return FolderResponseDTO.builder()
                .folderId(folder.getId())
                .parentId(folder.getParentFolder() == null ? null : folder.getParentFolder().getId())
                .title(folder.getTitle())
                .childrenCount(folder.getChildrenCount())
                .build();
    }
}
