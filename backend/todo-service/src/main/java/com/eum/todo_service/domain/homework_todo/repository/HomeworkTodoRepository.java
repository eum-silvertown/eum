package com.eum.todo_service.domain.homework_todo.repository;

import com.eum.todo_service.domain.homework_todo.entity.HomeworkTodo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface HomeworkTodoRepository extends MongoRepository<HomeworkTodo, Long> {
    Optional<HomeworkTodo> findByHomeworkIdAndStudentId(Long homeworkId, Long studentId);
    List<HomeworkTodo> findByStudentIdOrderByEndTimeAsc(Long studentId);
    void deleteByEndTimeBefore(LocalDateTime now);
}
