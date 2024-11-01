package com.eum.lecture_service.command.entity.folder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

	@Column(name = "lecture Id", nullable = false)
	private Long lectureId;

	@Column(name = "folder_name", nullable = false, length = 50)
	private String folderName;

	@Column(name = "parent_folder_id")
	private Long parentFolderId;
}
