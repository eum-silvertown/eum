package com.eum.folderservice.dto.response;

import com.eum.folderservice.domain.SavedFile;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SavedFileResponseDTO {
    private Long fileId;
    private String title;

    public static SavedFileResponseDTO of(SavedFile savedFile) {
        return SavedFileResponseDTO.builder()
                .fileId(savedFile.getId())
                .title(savedFile.getTitle())
                .build();
    }
}
