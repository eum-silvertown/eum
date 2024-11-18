package com.eum.folderservice.domain.savedFile.dto.request;

import com.eum.folderservice.domain.folder.entity.Folder;
import com.eum.folderservice.domain.savedFile.entity.SavedFile;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SavedFileModifyRequestDTO {
    private Long fileId;
    private String title;
}
