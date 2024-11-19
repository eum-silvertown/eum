package com.eum.todo_service.domain.todo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TodoStatusUpdateRequest {
    private Boolean status;

    public TodoStatusUpdateRequest(Boolean status) {
        this.status = status;
    }
}
