package com.eum.folderservice.dto.response;

import com.eum.folderservice.domain.SavedFile;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SavedFileResponseDTO {
    private Long fileId;
    private Long parentId;
    private String title;

    public static SavedFileResponseDTO of(SavedFile savedFile) {
        return SavedFileResponseDTO.builder()
                .fileId(savedFile.getId())
                .parentId(savedFile.getFolder().getId())
                .title(savedFile.getTitle())
                .build();
    }
}
