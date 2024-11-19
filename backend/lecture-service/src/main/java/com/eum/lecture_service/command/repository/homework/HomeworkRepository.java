package com.eum.lecture_service.command.repository.homework;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eum.lecture_service.command.entity.homework.Homework;

public interface HomeworkRepository extends JpaRepository<Homework, Long> {
}
