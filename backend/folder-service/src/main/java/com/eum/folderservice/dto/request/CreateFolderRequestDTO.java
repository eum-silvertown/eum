package com.eum.folderservice.dto.request;

import com.eum.folderservice.domain.Folder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateFolderRequestDTO {
    private String title;
    private Long parentId;
    @Setter
    private Long memberId;

    public Folder from(Folder parent) {
        return Folder.builder()
                .title(this.title)
                .memberId(this.memberId)
                .parentFolder(parent)
                .childrenCount(0L)
                .build();
    }
}