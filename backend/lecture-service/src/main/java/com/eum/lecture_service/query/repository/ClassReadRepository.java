package com.eum.lecture_service.query.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.eum.lecture_service.query.document.eventModel.ClassModel;

public interface ClassReadRepository extends MongoRepository<ClassModel, Long> {

	Optional<ClassModel> findBySchoolAndGradeAndClassNumber(String school, Long grade, Long classNumber);

	List<ClassModel> findBySchool(String school);
}
