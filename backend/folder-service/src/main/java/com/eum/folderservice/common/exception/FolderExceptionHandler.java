package com.eum.folderservice.common.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class FolderExceptionHandler {

    @ExceptionHandler(FolderException.class)
    public ResponseEntity<ErrorResponse<?>> handleFolderException(FolderException e) {
        ErrorCode errorCode = e.getErrorCode();
        return new ResponseEntity<>(ErrorResponse.error(errorCode), errorCode.getHttpStatus());
    }
}
