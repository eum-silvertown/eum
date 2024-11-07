package com.eum.lecture_service.query.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.eum.lecture_service.query.document.LectureModel;

public interface LectureReadRepository extends MongoRepository<LectureModel, Long> {

	List<LectureModel> findByClassId(Long classId);

	List<LectureModel> findByTeacherId(Long teacherId);

	List<LectureModel> findByYearAndSemester(Long year, Long semester);

	List<LectureModel> findBySchedule_DayAndYearAndSemester(String day, Long year, Long semester);

}
