package com.eum.folderservice.domain.savedFile.entity;

import com.eum.folderservice.domain.savedFile.dto.request.SavedFileModifyRequestDTO;
import com.eum.folderservice.global.util.BaseEntity;
import com.eum.folderservice.domain.folder.entity.Folder;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "saved_files")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedFile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    private Folder folder;

    private Long lectureId;
    private Long memberId;
    private String title;
    private String content;
    private String answer;

    public void update(String title, String content, String answer) {
        this.title = title;
        this.content = content;
        this.answer = answer;
    }

    public void moveFolder(Folder folder) {
        this.folder = folder;
    }
}
