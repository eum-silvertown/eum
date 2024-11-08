package com.eum.folderservice.controller;

import com.eum.folderservice.common.util.CommonResponse;
import com.eum.folderservice.service.SavedFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class SavedFileController {

    private final SavedFileService savedFileService;

    @GetMapping("/{fileId}")
    public CommonResponse<?> getFileDetails(@PathVariable Long fileId) {
        return CommonResponse.success(savedFileService.getSavedFileDetail(fileId), "문제 상세 조회 성공");
    }
}