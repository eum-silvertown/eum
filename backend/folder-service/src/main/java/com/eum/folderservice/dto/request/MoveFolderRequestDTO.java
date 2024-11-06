package com.eum.folderservice.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MoveFolderRequestDTO {
    private Long folderId;
    private Long toId;
}
