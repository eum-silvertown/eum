package com.eum.user_service.domain.file.dto;

import lombok.Builder;
import java.net.URL;

@Builder
public record ImageResponse(
        String image,
        String url
) {
    public static ImageResponse from(URL url, String image) {
        return ImageResponse.builder()
                .image(image)
                .url(url.toString())
                .build();
    }
}
