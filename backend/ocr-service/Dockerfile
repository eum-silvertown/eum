# 베이스 이미지로 Python 3.10 사용
FROM python:3.10

# 작업 디렉토리를 설정
WORKDIR /app

# 필요 라이브러리 설치를 위해 requirements.txt 파일을 컨테이너에 복사
COPY requirements.txt /app/requirements.txt

# 라이브러리 설치
RUN pip install --no-cache-dir -r /app/requirements.txt

# 모든 애플리케이션 파일을 컨테이너로 복사
COPY . /app

# 애플리케이션의 기본 포트를 오픈
EXPOSE 8085

# FastAPI 애플리케이션을 Uvicorn으로 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8085"]
