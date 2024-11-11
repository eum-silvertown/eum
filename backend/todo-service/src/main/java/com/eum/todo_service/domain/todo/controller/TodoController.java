package com.eum.todo_service.domain.todo.controller;

import com.eum.todo_service.domain.todo.dto.TodoRequest;
import com.eum.todo_service.domain.todo.dto.TodoResponse;
import com.eum.todo_service.domain.todo.service.TodoService;
import com.eum.todo_service.global.common.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/todo")
public class TodoController {

    private final TodoService todoService;

    @PostMapping
    public CommonResponse<?> makeNewTodo(@RequestHeader(value = "X-MEMBER-ID",required = false) String memberId,
                                         @RequestBody TodoRequest todoRequest) {
        TodoResponse todoResponse = todoService.createNewTodo(Long.valueOf(memberId),todoRequest);
        return CommonResponse.success(todoResponse, "todo 생성에 성공했습니다.");
    }


}
