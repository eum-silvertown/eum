package com.eum.lecture_service.command.service.lecture;

import java.util.Optional;

import com.eum.lecture_service.command.dto.lecture.LectureDto;
import com.eum.lecture_service.command.entity.lecture.Lecture;

public interface LectureService {

	Long createLecture(LectureDto lectureDto, Long teacherId);

	Long updateLecture(LectureDto lectureDto, Long lectureId);

	void deleteLecture(Long lectureId);

	Optional<Lecture> getLecture(Long lectureId);
}
