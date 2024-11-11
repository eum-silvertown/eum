package com.eum.todo_service.domain.todo.controller;

import com.eum.todo_service.domain.todo.dto.TodoListResponse;
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

    @PutMapping("/{todoId}")
    public CommonResponse<?> updateTodo(@RequestHeader(value = "X-MEMBER-ID",required = false) String memberId,
                                        @PathVariable Long todoId,
                                         @RequestBody TodoRequest todoRequest) {
        TodoResponse todoResponse = todoService.updateTodo(Long.valueOf(memberId),todoId,todoRequest);
        return CommonResponse.success(todoResponse, "todo 갱신에 성공했습니다.");
    }

    @DeleteMapping("/{todoId}")
    public CommonResponse<?> deleteTodo(@RequestHeader(value = "X-MEMBER-ID",required = false) String memberId,
                                        @PathVariable Long todoId) {
        todoService.deleteTodo(Long.valueOf(memberId),todoId);
        return CommonResponse.success("todo 삭제에 성공했습니다.");
    }

    @GetMapping
    public CommonResponse<?> getTodoList(@RequestHeader(value = "X-MEMBER-ID",required = false) String memberId) {
        TodoListResponse todoListResponse = todoService.getTodoList(Long.valueOf(memberId));
        return CommonResponse.success(todoListResponse, "todo 조회에 성공했습니다.");
    }


}
