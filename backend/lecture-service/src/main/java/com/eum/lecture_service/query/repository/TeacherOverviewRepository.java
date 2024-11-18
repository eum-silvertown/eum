package com.eum.lecture_service.query.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.eum.lecture_service.query.document.TeacherOverviewModel;

public interface TeacherOverviewRepository extends MongoRepository<TeacherOverviewModel, String> {

	Optional<TeacherOverviewModel> findByLectureId(Long lectureId);

	Optional<TeacherOverviewModel> findByTeacherIdAndLectureId(Long memberId, Long lectureId);

	List<TeacherOverviewModel> findByStudents_StudentId(Long studentId);

}

