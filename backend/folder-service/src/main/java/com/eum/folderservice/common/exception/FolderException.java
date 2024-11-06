package com.eum.folderservice.common.exception;

import lombok.Getter;

@Getter
public class FolderException extends RuntimeException {

    private final ErrorCode errorCode;

    public FolderException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
