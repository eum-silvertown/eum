package com.eum.lecture_service.command.service.lecture;

import java.util.Optional;

import com.eum.lecture_service.command.dto.lecture.LectureDto;
import com.eum.lecture_service.command.entity.lecture.Lecture;

public interface LectureService {

	void createLecture(LectureDto lectureDto, Long teacherId);

	void updateLecture(LectureDto lectureDto, Long lectureId);

	void deleteLecture(Long lectureId);

	Optional<Lecture> getLecture(Long lectureId);
}
