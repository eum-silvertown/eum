package com.eum.todo_service.domain.todo.controller;

import com.eum.todo_service.domain.todo.dto.TodoRequest;
import com.eum.todo_service.domain.todo.dto.TodoStatusUpdateRequest;
import com.eum.todo_service.global.common.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Todo", description = "Todo 관련 API")
public interface TodoApiDocumentation {

    @Operation(summary = "새로운 Todo 생성", description = "새로운 Todo 항목을 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Todo 생성 성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> makeNewTodo(String memberId, TodoRequest todoRequest);

    @Operation(summary = "Todo 갱신", description = "기존의 Todo 항목을 갱신합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Todo 갱신 성공"),
            @ApiResponse(responseCode = "400", description = "없는 todo 입니다"),
            @ApiResponse(responseCode = "401", description = "권한이 없습니다"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> updateTodo(String memberId, Long todoId, TodoRequest todoRequest);

    @Operation(summary = "Todo 삭제", description = "Todo 항목을 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Todo 삭제 성공"),
            @ApiResponse(responseCode = "400", description = "없는 todo 입니다"),
            @ApiResponse(responseCode = "401", description = "권한이 없습니다"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> deleteTodo(String memberId, Long todoId);

    @Operation(summary = "Todo 목록 조회", description = "회원의 모든 Todo 항목을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Todo 목록 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> getTodoList(String memberId);

    @Operation(summary = "Todo 상태 업데이트", description = "Todo 항목의 완료 상태를 업데이트합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Todo 상태 변경 성공"),
            @ApiResponse(responseCode = "400", description = "없는 todo 입니다"),
            @ApiResponse(responseCode = "401", description = "권한이 없습니다"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> updateTodoState(String memberId, Long todoId, TodoStatusUpdateRequest todoStatusUpdateRequest);
}