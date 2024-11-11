package com.eum.todo_service.domain.todo.repository;

import com.eum.todo_service.domain.todo.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    @Query("SELECT t FROM Todo t WHERE t.memberId = :memberId ORDER BY t.priority ASC, t.updatedAt DESC")
    List<Todo> findByMemberIdOrderByPriorityAndUpdatedAtDesc(@Param("memberId") Long memberId);
}
