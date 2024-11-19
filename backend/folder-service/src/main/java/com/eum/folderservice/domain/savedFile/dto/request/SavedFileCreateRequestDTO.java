package com.eum.folderservice.domain.savedFile.dto.request;

import com.eum.folderservice.domain.folder.entity.Folder;
import com.eum.folderservice.domain.savedFile.entity.SavedFile;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SavedFileCreateRequestDTO {
    private Long folderId;
    private Long memberId;
    private String title;
    private String content;
    private String answer;

    public SavedFile from(Folder folder) {
        return SavedFile.builder()
                .title(this.title)
                .folder(folder)
                .memberId(this.memberId)
                .content(this.content)
                .answer(this.answer)
                .build();
    }
}
