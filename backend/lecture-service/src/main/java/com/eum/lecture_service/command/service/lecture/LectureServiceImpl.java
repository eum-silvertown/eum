package com.eum.lecture_service.command.service.lecture;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.eum.lecture_service.command.dto.lecture.LectureDto;
import com.eum.lecture_service.command.entity.folder.Folder;
import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.command.entity.lecture.LectureSchedule;
import com.eum.lecture_service.command.repository.folder.FolderRepository;
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
	private final FolderRepository folderRepository;

	@Override
	public void createLecture(LectureDto lectureDto, Long teacherId) {
		validateLectureSchedule(lectureDto);

		//lecture 저장
		Lecture lectureEntity = lectureDto.toLectureEntity(teacherId);
		Lecture savedLecture = lectureRepository.save(lectureEntity);

		//lecture 스케줄 저장
		List<LectureSchedule> lectureScheduleEntities = lectureDto.toLectureScheduleEntities(savedLecture.getLectureId());
		lectureScheduleRepository.saveAll(lectureScheduleEntities);

		//기본 폴더 생성
		createDefaultFolders(savedLecture.getLectureId());
	}

	private void validateLectureSchedule(LectureDto lectureDto) {
		Long classId = lectureDto.getClassId();
		for (LectureDto.Schedule schedule : lectureDto.getSchedule()) {
			List<LectureSchedule> existingSchedules = lectureScheduleRepository.findByClassIdAndDayAndPeriod(
				classId, schedule.getDay(), schedule.getPeriod());
			if (!existingSchedules.isEmpty()) {
				//이미 수업이 있으니까 익셉션처리
				throw new EumException(ErrorCode.SCHEDULE_CONFLICT);
			}
		}
	}

	private void createDefaultFolders(Long lectureId) {
		String[] folderNames = {"문제 보관함", "다시보기", "숙제", "시험"};

		Arrays.stream(folderNames).forEach(name -> {
			Folder folder = Folder.builder()
				.lectureId(lectureId)
				.folderName(name)
				.build();
			folderRepository.save(folder);
		});
	}

	@Override
	public void updateLecture(LectureDto lectureDto, Long lectureId) {
		Lecture findLecture = lectureRepository.findById(lectureId).orElseThrow(() ->
			new EumException(ErrorCode.LECTURE_NOT_FOUND));

		findLecture.updateFromDTO(lectureDto);

		lectureRepository.save(findLecture);

		//아직 스케줄 변경하는 건 없음;
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
		return Optional.empty();
	}
}
