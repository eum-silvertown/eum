package com.eum.todo_service.domain.event.handler;

import com.eum.todo_service.domain.event.dto.HomeworkTodoCreateEvent;
import com.eum.todo_service.domain.event.dto.HomeworkTodoDeleteEvent;
import com.eum.todo_service.domain.homework_todo.entity.HomeworkTodo;
import com.eum.todo_service.domain.homework_todo.repository.HomeworkTodoRepository;
import com.eum.todo_service.global.exception.ErrorCode;
import com.eum.todo_service.global.exception.EumException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class HomeworkTodoListener {

    private final HomeworkTodoRepository homeworkTodoRepository;

    @KafkaListener(topics = "homework-todo-create-topic", groupId = "homework-todo-group", properties = {
            "spring.json.value.default.type=com.eum.todo_service.domain.event.dto.HomeworkTodoCreateEvent"
    })
    public void handleHomeworkTodoCreate(HomeworkTodoCreateEvent event) {
        event.getStudentIds().forEach(studentId ->
                homeworkTodoRepository.save(HomeworkTodo.from(event, studentId))
        );
    }

    @KafkaListener(topics = "homework-todo-delete-topic", groupId = "homework-todo-group", properties = {
            "spring.json.value.default.type=com.eum.todo_service.domain.event.dto.HomeworkTodoDeleteEvent"
    })
    public void handleHomeworkTodoDelete(HomeworkTodoDeleteEvent event) {
        HomeworkTodo homeworkTodo = homeworkTodoRepository
                .findByHomeworkIdAndStudentId(event.getHomeworkId(), event.getStudentId())
                .orElseThrow(() -> new EumException(ErrorCode.TODO_HOMEWORK_NOT_FOUND));

        homeworkTodoRepository.delete(homeworkTodo);
    }

}
