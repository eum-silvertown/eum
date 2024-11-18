package com.eum.lecture_service.query.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.document.eventModel.StudentModel;

public interface StudentReadRepository extends MongoRepository<StudentModel, Long> {

	List<StudentModel> findByClassId(Long classId);

}
