package com.eum.todo_service.global.scheduler;

import com.eum.todo_service.domain.homework_todo.repository.HomeworkTodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class HomeworkTodoScheduler {

    private final HomeworkTodoRepository homeworkTodoRepository;

    @Scheduled(cron = "0 0 0 * * *")
    public void deleteExpiredHomeworkTodos() {
        homeworkTodoRepository.deleteByEndTimeBefore(LocalDateTime.now());
    }
}
