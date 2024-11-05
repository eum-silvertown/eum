package com.eum.folderservice.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModifyTitleRequestDTO {
    private Long folderId;
    private String title;
}
