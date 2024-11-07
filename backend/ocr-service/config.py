import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

class Config:
    # AWS S3 설정
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION = os.getenv("AWS_REGION", "ap-northeast-2")
    S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
    S3_PREFIX = os.getenv("S3_PREFIX", "uploads/")

    # Mathpix API 설정
    MATHPIX_APP_ID = os.getenv("MATHPIX_APP_ID")
    MATHPIX_APP_KEY = os.getenv("MATHPIX_APP_KEY")
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

    EUREKA_SERVER_URL = os.getenv("EUREKA_SERVER_URL")
    SERVICE_NAME = os.getenv("SERVICE_NAME", "ocr-service")
    SERVICE_HOST = os.getenv("SERVICE_HOST", "0.0.0.0")  # EC2 퍼블릭 IP로 변경
    SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8085))
    SERVER_URL = os.getenv("SERVER_URL")
# Config 객체 인스턴스화
config = Config()
