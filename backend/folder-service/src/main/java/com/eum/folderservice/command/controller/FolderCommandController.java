package com.eum.folderservice.command.controller;

import com.eum.folderservice.command.dto.CreateFolderRequestDTO;
import com.eum.folderservice.command.service.FolderCommandService;
import com.eum.folderservice.common.util.CommonResponse;
import com.eum.folderservice.query.dto.CreateFolderResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/folder")
@RequiredArgsConstructor
public class FolderCommandController {

    private final FolderCommandService folderCommandService;

    @PostMapping
    public CommonResponse<?> createFolder(HttpServletRequest request, @RequestBody CreateFolderRequestDTO requestDTO) {
        Long memberId = Long.parseLong(request.getHeader("X-MEMBER-ID"));
        requestDTO.setMemberId(memberId);
        CreateFolderResponseDTO response = folderCommandService.createFolder(requestDTO);

        return CommonResponse.success(response, "폴더 생성 성공");
    }
}
