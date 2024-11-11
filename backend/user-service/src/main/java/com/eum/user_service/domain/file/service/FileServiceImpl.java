package com.eum.user_service.domain.file.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.Headers;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.eum.user_service.domain.file.dto.ImageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileServiceImpl implements FileService{
    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    private final AmazonS3 amazonS3;

    private static final String PREFIX = "image/";

    @Override
    public ImageResponse getPresignedUrlForUpload(String imageName) {
        String key = PREFIX + imageName;
        GeneratePresignedUrlRequest generatePresignedUrlRequest = getGeneratePresignedUrlForUpload(bucket, key);
        URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);
        return ImageResponse.from(url,key);
    }

    @Override
    public ImageResponse getPresignedUrlForRead(String key) {
        GeneratePresignedUrlRequest generatePresignedUrlRequest = getGeneratePresignedUrlForRead(bucket, key);
        URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);
        return ImageResponse.from(url,key);
    }

    @Override
    public void deleteImage(String imageName) {
        if (amazonS3.doesObjectExist(bucket, imageName)) {
            // 동일한 이름의 파일이 존재하면 삭제
            amazonS3.deleteObject(bucket, imageName);
        }
    }

    private GeneratePresignedUrlRequest getGeneratePresignedUrlForRead(String bucket, String key) {
        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucket, key)
                .withMethod(HttpMethod.GET)
                .withExpiration(getPresignedUrlExpiration());

        generatePresignedUrlRequest.addRequestParameter(
                Headers.S3_CANNED_ACL,
                CannedAccessControlList.PublicRead.toString()
        );

        return generatePresignedUrlRequest;
    }

    private GeneratePresignedUrlRequest getGeneratePresignedUrlForUpload(String bucket, String key) {
        deleteImage(key);

        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucket, key)
                .withMethod(HttpMethod.PUT)
                .withExpiration(getPresignedUrlExpiration());

        generatePresignedUrlRequest.addRequestParameter(
                Headers.S3_CANNED_ACL,
                CannedAccessControlList.PublicRead.toString()
        );

        return generatePresignedUrlRequest;
    }

    private Date getPresignedUrlExpiration() {
        Date expiration = new Date();
        long expTimeMillis = expiration.getTime();
        expTimeMillis += 1000 * 60 * 10;
        expiration.setTime(expTimeMillis);

        return expiration;
    }

}
