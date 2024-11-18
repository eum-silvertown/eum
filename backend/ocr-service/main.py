from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from s3_service import S3Service
from ocr_service import PDFConverterService
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from py_eureka_client import eureka_client
import uvicorn
import socket
from config import config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app_: FastAPI):
    # Startup
    host_ip = "localhost"
    logger.info(f"Initializing Eureka client with host: {host_ip}, port: 8000")
    await eureka_client.init_async(
        eureka_server=config.EUREKA_SERVER_URL,
        app_name=config.SERVICE_NAME,
        instance_port=config.SERVICE_PORT,
        instance_host=config.SERVICE_HOST,  # EC2 퍼블릭 IP 또는 도메인
        instance_ip=config.SERVICE_HOST     # 퍼블릭 IP를 사용
    )
    logger.info("Eureka client initialized")
    yield
    # Shutdown
    logger.info("Stopping Eureka client")
    await eureka_client.stop_async()

# FastAPI 앱 초기화
app = FastAPI(
    lifespan=lifespan,
    docs_url="/api/docs",         # Swagger UI 경로
    openapi_url="/api/openapi.json"  # OpenAPI 스펙 경로
)

# OpenAPI 문서에 `servers` 항목을 추가하는 함수
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = app.openapi()
    openapi_schema["servers"] = [{"url": config.SERVER_URL, "description": "Production Server"}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

# 커스텀 OpenAPI 설정을 FastAPI에 적용
app.openapi = custom_openapi

# S3Service와 PDF 변환 서비스 인스턴스 생성
s3_service = S3Service()
pdf_converter_service = PDFConverterService()

# 요청 모델 정의
class UploadRequest(BaseModel):
    image_name: str

class ReadRequest(BaseModel):
    key: str

class PDFConvertKeyRequest(BaseModel):
    key: str

# 업로드용 presigned URL 생성 엔드포인트
@app.post("/ocr/generate-presigned-url/upload")
async def generate_presigned_url_for_upload(request: UploadRequest):
    try:
        response = s3_service.get_presigned_url_for_upload(request.image_name)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# PDF 변환 및 상태 확인 엔드포인트 (키 값 기반)
@app.post("/ocr/convert-pdf")
async def convert_pdf_and_check_status(request: PDFConvertKeyRequest):
    try:
        # S3의 키 값으로 PDF 변환 및 상태 확인
        result = pdf_converter_service.convert_pdf_and_check_status(request.key)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ocr")
async def read_root():
    logger.info("Handling request for root path")
    return {"Hello": "World"}

@app.get("/ocr/health")
async def health_check():
    logger.info("Handling health check request")
    return {"status": "UP"}

if __name__ == "__main__":
    logger.info("Starting FastAPI application")
    uvicorn.run(app, host="0.0.0.0", port=8085)