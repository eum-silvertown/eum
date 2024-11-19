package com.eum.lecture_service.command.repository.lecture;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eum.lecture_service.command.entity.lecture.LectureSchedule;

public interface LectureScheduleRepository extends JpaRepository<LectureSchedule, Long> {

	List<LectureSchedule> findByLectureClassIdAndDayAndPeriod(Long classId, String day, Long period);
}
