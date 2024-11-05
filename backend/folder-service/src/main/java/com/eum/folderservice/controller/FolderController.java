package com.eum.folderservice.controller;

import com.eum.folderservice.dto.request.CreateFolderRequestDTO;
import com.eum.folderservice.dto.request.ModifyTitleRequestDTO;
import com.eum.folderservice.dto.response.FolderResponseDTO;
import com.eum.folderservice.service.FolderService;
import com.eum.folderservice.common.util.CommonResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/folder")
@RequiredArgsConstructor
public class FolderController {

    private final FolderService folderService;

    @PostMapping
    public CommonResponse<?> createFolder(@RequestBody CreateFolderRequestDTO requestDTO, HttpServletRequest request) {
        Long memberId = Long.parseLong(request.getHeader("X-MEMBER-ID"));
        requestDTO.setMemberId(memberId);
        FolderResponseDTO response = folderService.createFolder(requestDTO);

        return CommonResponse.success(response, "폴더 생성 성공");
    }

    @GetMapping("/{folderId}")
    public CommonResponse<?> getFolder(@PathVariable Long folderId, HttpServletRequest request) {
        Long memberId = Long.parseLong(request.getHeader("X-MEMBER-ID"));

        return CommonResponse.success(folderService.getSubFolders(folderId, memberId), "폴더 조회 성공");
    }

    @PatchMapping
    public CommonResponse<?> modifyFolderTitle(@RequestBody ModifyTitleRequestDTO requestDTO, HttpServletRequest request) {
        Long memberId = Long.parseLong(request.getHeader("X-MEMBER-ID"));

        return CommonResponse.success(folderService.modifyFolderTitle(requestDTO, memberId), "폴더 이름 변경 성공");
    }
}
