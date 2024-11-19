package com.eum.folderservice.domain.folder.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModifyTitleRequestDTO {
    private Long folderId;
    private String title;
}
