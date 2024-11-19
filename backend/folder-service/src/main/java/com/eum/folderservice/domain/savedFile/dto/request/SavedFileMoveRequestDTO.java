package com.eum.folderservice.domain.savedFile.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SavedFileMoveRequestDTO {
    private Long fileId;
    private Long toId;
}
