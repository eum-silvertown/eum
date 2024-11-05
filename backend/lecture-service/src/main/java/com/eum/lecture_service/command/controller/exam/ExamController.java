package com.eum.lecture_service.command.controller.exam;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eum.lecture_service.command.dto.exam.ExamDto;
import com.eum.lecture_service.command.dto.exam.ExamProblemSubmissionDto;
import com.eum.lecture_service.command.entity.exam.Exam;
import com.eum.lecture_service.command.entity.exam.ExamSubmission;
import com.eum.lecture_service.command.service.exam.ExamService;
import com.eum.lecture_service.command.service.exam.ExamSubmissionService;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.config.global.CommonResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/exam")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;
    private final ExamSubmissionService examSubmissionService;

    // 시험 생성
    @PostMapping
    public CommonResponse<?> createExam(
            @RequestHeader("X-MEMBER-ROLE") String role,
            @RequestBody ExamDto examDTO) {
        if(!role.equals("TEACHER")) {
            throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
        }
        Long examId = examService.creerExam(examDTO);
        return CommonResponse.success(examId, "시험 생성 성공");
    }

    // 시험 수정
    @PutMapping("/{examId}")
    public CommonResponse<?> updateExam(
            @RequestHeader("X-MEMBER-ROLE") String role,
            @PathVariable Long examId,
            @RequestBody ExamDto examDTO) {
        if(!role.equals("TEACHER")) {
            throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
        }
        Long updatedExamId = examService.updateExam(examId, examDTO);
        return CommonResponse.success(updatedExamId, "시험 수정 성공");
    }

    // 시험 삭제
    @DeleteMapping("/{examId}")
    public CommonResponse<Void> deleteExam(
            @RequestHeader("X-MEMBER-ROLE") String role,
            @PathVariable Long examId) {
        if(!role.equals("TEACHER")) {
            throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
        }
        examService.deleteExam(examId);
        return CommonResponse.success("시험 삭제 성공");
    }

    // 시험 문제 제출
    @PostMapping("/{examId}/submission")
    public CommonResponse<?> submitExamProblems(
        @RequestHeader("X-MEMBER-ROLE") String role,
        @RequestHeader("X-MEMBER-ID") Long studentId,
        @PathVariable Long examId,
        @RequestBody List<ExamProblemSubmissionDto> examProblemSubmissions) {
        if(!role.equals("STUDENT")) {
            throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
        }
        ExamSubmission examSubmission = examSubmissionService.submitExamProblems(examId, studentId, examProblemSubmissions);
        return CommonResponse.success(examSubmission, "시험 제출 성공");
    }
}