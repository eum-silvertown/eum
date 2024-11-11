package com.eum.todo_service.domain.todo.entity;

import com.eum.todo_service.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Getter
@Entity
@Table(name = "todos")
public class Todo extends BaseEntity {
    @Id
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

}