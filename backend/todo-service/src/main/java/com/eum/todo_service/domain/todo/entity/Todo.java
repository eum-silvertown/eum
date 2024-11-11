package com.eum.todo_service.domain.todo.entity;

import com.eum.todo_service.domain.todo.dto.TodoRequest;
import com.eum.todo_service.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "todos")
public class Todo extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "title", nullable = false, length = 50)
    private String title;

    @Column(name = "content", nullable = false, length = 100)
    private String content;

    @Column(name = "priority", nullable = false)
    private Integer priority;

    @Column(name = "isDone", nullable = false)
    private Boolean isDone;

    @Builder
    public Todo(Long memberId, String title, String content, Integer priority) {
        this.memberId = memberId;
        this.title = title;
        this.content = content;
        this.priority = priority;
        this.isDone = false;
    }

    public static Todo from(TodoRequest todoRequest, Long memberId) {
        return Todo.builder()
                .memberId(memberId)
                .title(todoRequest.getTitle())
                .content(todoRequest.getContent())
                .priority(todoRequest.getPriority())
                .build();
    }

}