package com.eum.lecture_service.query.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.eum.lecture_service.query.document.LectureModel;

public interface LectureReadRepository extends MongoRepository<LectureModel, Long> {

	List<LectureModel> findByClassId(Long classId);

	List<LectureModel> findByTeacherId(Long teacherId);

	Optional<LectureModel> findByTeacherIdAndClassId(Long teacherId, Long classId);

	List<LectureModel> findByYearAndSemester(Long year, Long semester);

	Collection<LectureModel> findByClassIdAndSchedule_DayAndYearAndSemester(Long classId, String day, Long year, Long semester);

	Collection<LectureModel> findByTeacherIdAndSchedule_DayAndYearAndSemester(Long memberId, String day, Long year, Long semester);
}
