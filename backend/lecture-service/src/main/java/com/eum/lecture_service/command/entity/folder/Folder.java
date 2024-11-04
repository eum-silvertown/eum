package com.eum.lecture_service.command.entity.folder;

import java.util.List;

import com.eum.lecture_service.command.entity.lecture.Lecture;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "folders")
public class Folder {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "folder_id")
	private Long folderId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "lecture_id", nullable = false)
	private Lecture lecture;

	@Column(name = "folder_name", nullable = false, length = 50)
	private String folderName;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_folder_id")
	private Folder parentFolder;

	@OneToMany(mappedBy = "parentFolder", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Folder> childFolders;

	@OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<FolderItem> folderItems;
}
