package com.eum.folderservice.dto.response;

import com.eum.folderservice.domain.SavedFile;
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
                .category(savedFile.getCategory())
                .title(savedFile.getTitle())
                .content(savedFile.getContent())
                .answer(savedFile.getAnswer())
                .build();
    }
}
