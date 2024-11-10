package com.eum.lecture_service.query.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.eum.lecture_service.query.document.StudentOverviewModel;

public interface StudentOverviewRepository extends MongoRepository<StudentOverviewModel, String> {

	Optional<StudentOverviewModel> findByStudentIdAndLectureId(Long studentId, Long lectureId);

	List<StudentOverviewModel> findByLectureId(Long lectureId);
}
