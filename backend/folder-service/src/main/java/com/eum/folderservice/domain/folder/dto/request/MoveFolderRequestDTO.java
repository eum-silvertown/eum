package com.eum.folderservice.domain.folder.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MoveFolderRequestDTO {
    private Long folderId;
    private Long toId;
}
