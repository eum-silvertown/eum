package com.eum.folderservice.dto.response;

import com.eum.folderservice.domain.Folder;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SubFolderResponseDTO {
    private Long folderId;
    private String title;
    private Long childrenCount;

    public static SubFolderResponseDTO of(Folder folder) {
        return SubFolderResponseDTO.builder()
                .folderId(folder.getId())
                .title(folder.getTitle())
                .childrenCount(folder.getChildrenCount())
                .build();
    }
}
