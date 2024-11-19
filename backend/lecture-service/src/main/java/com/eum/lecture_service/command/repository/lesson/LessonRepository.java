package com.eum.lecture_service.command.repository.lesson;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eum.lecture_service.command.entity.lesson.Lesson;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
}
