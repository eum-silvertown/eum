package com.eum.lecture_service.command.service.lecture;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eum.lecture_service.command.dto.lecture.LectureDto;
import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.command.entity.lecture.LectureSchedule;
import com.eum.lecture_service.command.repository.lecture.LectureRepository;
import com.eum.lecture_service.command.repository.lecture.LectureScheduleRepository;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LectureServiceImpl implements LectureService{

	private final LectureRepository lectureRepository;
	private final LectureScheduleRepository lectureScheduleRepository;

	@Override
	@Transactional
	public Long createLecture(LectureDto lectureDto, Long teacherId) {
		Lecture lecture = lectureDto.toLectureEntity(teacherId);

		lectureRepository.save(lecture);

		List<LectureSchedule> schedules = lectureDto.toLectureScheduleEntities(lecture);

		validateLectureSchedule(schedules, lecture.getClassId());

		lecture.setLectureSchedules(schedules);

		Lecture savedLecture = lectureRepository.save(lecture);

		return savedLecture.getLectureId();
	}

	private void validateLectureSchedule(List<LectureSchedule> schedules, Long classId) {
		for (LectureSchedule schedule : schedules) {
			List<LectureSchedule> existingSchedules = lectureScheduleRepository.findByLectureClassIdAndDayAndPeriod(
				classId, schedule.getDay(), schedule.getPeriod());

			if (!existingSchedules.isEmpty()) {
				throw new EumException(ErrorCode.SCHEDULE_CONFLICT);
			}
		}
	}


	@Override
	@Transactional
	public Long updateLecture(LectureDto lectureDto, Long lectureId) {
		Lecture lecture = lectureRepository.findById(lectureId)
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		lecture.updateFromDTO(lectureDto);

		if (lectureDto.getSchedule() != null) {
			lecture.getLectureSchedules().clear();
			List<LectureSchedule> newSchedules = lectureDto.toLectureScheduleEntities(lecture);
			validateLectureSchedule(newSchedules, lecture.getClassId());
			lecture.getLectureSchedules().addAll(newSchedules);
		}

		Lecture savedLecture = lectureRepository.save(lecture);

		return savedLecture.getLectureId();
	}

	@Override
	public void deleteLecture(Long lectureId) {
		if (!lectureRepository.existsById(lectureId)) {
			throw new EumException(ErrorCode.LECTURE_NOT_FOUND);
		}
		lectureRepository.deleteById(lectureId);
	}

	@Override
	public Optional<Lecture> getLecture(Long lectureId) {
		return lectureRepository.findById(lectureId);
	}
}
