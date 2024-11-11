package com.eum.folderservice.domain.folder.entity;

import com.eum.folderservice.global.util.BaseEntity;
import com.eum.folderservice.domain.savedFile.entity.SavedFile;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "folders")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Folder extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long memberId;

    private String title;

    @ColumnDefault("0")
    private Long childrenCount;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_folder_id")
    private Folder parentFolder;

    @OneToMany(mappedBy = "parentFolder", cascade = CascadeType.ALL)
    private List<Folder> subFolders = new ArrayList<>();

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL)
    private List<SavedFile> savedFiles = new ArrayList<>();

    public void addChildFolder(Folder folder) {
        this.subFolders.add(folder);
        this.childrenCount = (long) this.subFolders.size();
    }

    public void removeChildFolder(Folder folder) {
        this.subFolders.remove(folder);
        this.childrenCount = (long) this.subFolders.size();
    }

    public void modifyTitle(String title) {
        this.title = title;
    }
}
