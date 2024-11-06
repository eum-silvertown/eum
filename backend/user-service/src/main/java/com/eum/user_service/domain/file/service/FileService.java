package com.eum.user_service.domain.file.service;

import com.eum.user_service.domain.file.dto.ImageResponse;

public interface FileService {
    ImageResponse getPresignedUrlForUpload(String imageName);
    ImageResponse getPresignedUrlForRead(String imageName);
}
