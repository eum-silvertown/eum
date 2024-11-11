package com.eum.folderservice.domain.savedFile.dto.response;

import com.eum.folderservice.domain.savedFile.entity.SavedFile;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SavedFileDetailResponseDTO {
    private Long fileId;
    private String category;
    private String title;
    private String content;
    private String answer;

    public static SavedFileDetailResponseDTO of(SavedFile savedFile) {
        return SavedFileDetailResponseDTO.builder()
                .fileId(savedFile.getId())
                .title(savedFile.getTitle())
                .content(savedFile.getContent())
                .answer(savedFile.getAnswer())
                .build();
    }
}
