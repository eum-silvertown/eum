package com.eum.folderservice.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Server
    INTERNAL_SERVER_ERROR("S001", "내부 서버 오류", HttpStatus.INTERNAL_SERVER_ERROR),

    // Folder
    FOLDER_NOT_FOUND_ERROR("F001", "해당 폴더를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    FOLDER_ALREADY_EXISTS_ERROR("F002", "해당 폴더가 이미 존재합니다.", HttpStatus.BAD_REQUEST),
    ROOT_FOLDER_DELETE_ERROR("F003", "최상위 폴더는 삭제할 수 없습니다.", HttpStatus.BAD_REQUEST),
    ROOT_FOLDER_MOVE_ERROR("F004", "최상위 폴더는 이동할 수 없습니다.", HttpStatus.BAD_REQUEST),

    // File(Question)
    FILE_NOT_FOUND_ERROR("Q001", "해당 파일을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    ;

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
