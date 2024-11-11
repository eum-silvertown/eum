package com.eum.folderservice.domain.savedFile.api;

import com.eum.folderservice.domain.savedFile.dto.request.SavedFileCreateRequestDTO;
import com.eum.folderservice.domain.savedFile.dto.request.SavedFileModifyRequestDTO;
import com.eum.folderservice.domain.savedFile.dto.request.SavedFileMoveRequestDTO;
import com.eum.folderservice.global.util.CommonResponse;
import com.eum.folderservice.domain.savedFile.service.SavedFileService;
import io.micrometer.core.annotation.Timed;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class SavedFileController {

    private final SavedFileService savedFileService;

    @PostMapping
    @Timed(value = "files.create", longTask = true)
    public CommonResponse<?> createFile(@RequestBody SavedFileCreateRequestDTO requestDTO, HttpServletRequest request) {
        Long memberId = Long.parseLong(request.getHeader("X-MEMBER-ID"));
        requestDTO.setMemberId(memberId);

        return CommonResponse.success(savedFileService.createSavedFile(requestDTO), "문제 생성 성공");
    }

    @GetMapping("/{fileId}")
    @Timed(value = "files.get", longTask = true)
    public CommonResponse<?> getFileDetails(@PathVariable Long fileId) {
        return CommonResponse.success(savedFileService.getSavedFileDetail(fileId), "문제 상세 조회 성공");
    }

    @PutMapping
    @Timed(value = "files.modify", longTask = true)
    public CommonResponse<?> modifyFile(@RequestBody SavedFileModifyRequestDTO requestDTO) {
        return CommonResponse.success(savedFileService.modifySavedFile(requestDTO), "문제 수정 성공");
    }

    @DeleteMapping("/{fileId}")
    @Timed(value = "files.delete", longTask = true)
    public CommonResponse<?> deleteFile(@PathVariable Long fileId) {
        savedFileService.deleteSavedFile(fileId);
        return CommonResponse.success(null, "문제 삭제 성공");
    }

    @PostMapping("/move")
    @Timed(value = "files.move", longTask = true)
    public CommonResponse<?> moveFolder(@RequestBody SavedFileMoveRequestDTO requestDTO) {
        savedFileService.moveFolder(requestDTO);
        return CommonResponse.success(null, "문제 이동 성공");
    }
}
