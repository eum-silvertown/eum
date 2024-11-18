import boto3
from botocore.exceptions import ClientError
from fastapi import HTTPException
import uuid
from config import config  # 설정 가져오기

class S3Service:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=config.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=config.AWS_SECRET_ACCESS_KEY,
            region_name=config.AWS_REGION
        )
        self.bucket_name = config.S3_BUCKET_NAME
        self.prefix = config.S3_PREFIX

    def generate_unique_key(self, filename):
        # 파일 이름에 UUID를 추가하여 중복을 방지
        unique_id = uuid.uuid4()
        return f"{self.prefix}{filename}_{unique_id}"

    def get_presigned_url_for_upload(self, image_name):
        # 고유한 객체 키 생성
        key = self.generate_unique_key(image_name)
        
        # presigned URL 생성
        try:
            presigned_url = self.s3_client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': key
                },
                ExpiresIn=600  # URL 만료 시간 (10분)
            )
            return {"url": presigned_url, "key": key}
        except ClientError as e:
            raise HTTPException(status_code=500, detail="Failed to generate presigned URL for upload")

    def get_presigned_url_for_read(self, key):
        # 읽기용 presigned URL 생성
        try:
            presigned_url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': key},
                ExpiresIn=600  # URL 만료 시간 (10분)
            )
            return {"url": presigned_url}
        except ClientError as e:
            raise HTTPException(status_code=500, detail="Failed to generate presigned URL for read")
