package com.eum.drawingservice.domain.blackboard.api;

import com.eum.drawingservice.domain.blackboard.service.BlackBoardService;
import com.eum.drawingservice.global.CommonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/drawing")
@RequiredArgsConstructor
public class BlackBoardRestController {

    private final BlackBoardService blackBoardService;

    @GetMapping("/snapshot/{classroomId}")
    public CommonResponse<?> getSnapshot(@PathVariable String classroomId) {
        return CommonResponse.success(blackBoardService.getSnapShot(classroomId), "저장된 스냅샷 조회 성공");
    }
}
