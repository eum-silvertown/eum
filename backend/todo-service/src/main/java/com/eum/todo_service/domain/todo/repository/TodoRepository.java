package com.eum.todo_service.domain.todo.repository;

import com.eum.todo_service.domain.todo.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {
}
