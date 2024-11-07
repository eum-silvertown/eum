package com.eum.folderservice.controller;

import com.eum.folderservice.dto.request.CreateFolderRequestDTO;
import com.eum.folderservice.dto.request.ModifyTitleRequestDTO;
import com.eum.folderservice.dto.request.MoveFolderRequestDTO;
import com.eum.folderservice.dto.response.FolderResponseDTO;
import com.eum.folderservice.service.FolderService;
import com.eum.folderservice.common.util.CommonResponse;
import io.micrometer.core.annotation.Timed;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/folder")
@RequiredArgsConstructor
public class FolderController {

    private final FolderService folderService;

    @PostMapping
    @Timed(value = "folders.create", longTask = true)
    public CommonResponse<?> createFolder(@RequestBody CreateFolderRequestDTO requestDTO, HttpServletRequest request) {
        Long memberId = Long.parseLong(request.getHeader("X-MEMBER-ID"));
        requestDTO.setMemberId(memberId);
        FolderResponseDTO response = folderService.createFolder(requestDTO);

        return CommonResponse.success(response, "폴더 생성 성공");
    }

    @GetMapping("/root")
    @Timed(value = "folders.root", longTask = true)
    public CommonResponse<?> getMemberRootFolder(HttpServletRequest request) {
        Long memberId = Long.parseLong(request.getHeader("X-MEMBER-ID"));

        return CommonResponse.success(folderService.getRootFolder(memberId), "루트 폴더 조회 성공");
    }

    @GetMapping("/{folderId}")
    @Timed(value = "folders.get", longTask = true)
    public CommonResponse<?> getFolder(@PathVariable Long folderId, HttpServletRequest request) {
        Long memberId = Long.parseLong(request.getHeader("X-MEMBER-ID"));

        return CommonResponse.success(folderService.getSubFolders(folderId, memberId), "폴더 조회 성공");
    }

    @PatchMapping
    @Timed(value = "folders.modify", longTask = true)
    public CommonResponse<?> modifyFolderTitle(@RequestBody ModifyTitleRequestDTO requestDTO, HttpServletRequest request) {
        Long memberId = Long.parseLong(request.getHeader("X-MEMBER-ID"));

        return CommonResponse.success(folderService.modifyFolderTitle(requestDTO, memberId), "폴더 이름 변경 성공");
    }

    @DeleteMapping("/{folderId}")
    @Timed(value = "folders.delete", longTask = true)
    public CommonResponse<?> deleteFolder(@PathVariable Long folderId, HttpServletRequest request) {
        Long memberId = Long.parseLong(request.getHeader("X-MEMBER-ID"));
        folderService.deleteFolder(folderId, memberId);

        return CommonResponse.success("폴더 삭제 성공");
    }

    @PostMapping("/move")
    @Timed(value = "folders.move", longTask = true)
    public CommonResponse<?> moveFolder(@RequestBody MoveFolderRequestDTO requestDTO, HttpServletRequest request) {
        Long memberId = Long.parseLong(request.getHeader("X-MEMBER-ID"));
        folderService.moveFolder(requestDTO, memberId);

        return CommonResponse.success("폴더 이동 성공");
    }
}
