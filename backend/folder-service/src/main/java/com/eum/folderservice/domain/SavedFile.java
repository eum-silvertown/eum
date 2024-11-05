package com.eum.folderservice.domain;

import com.eum.folderservice.common.util.BaseEntity;
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
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    private Folder folder;

    private Long lectureId;
    private String category;
    private String title;
    private String content;
    private String answer;
}
