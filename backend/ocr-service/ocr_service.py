import requests
import json
import tempfile
import time
from config import config  # 설정 가져오기
from s3_service import S3Service  # S3Service 가져오기
import anthropic
import re
import logging
import traceback

class PDFConverterService:
    def __init__(self):
        self.app_id = config.MATHPIX_APP_ID
        self.app_key = config.MATHPIX_APP_KEY
        self.claude_key = config.ANTHROPIC_API_KEY
        self.s3_service = S3Service()  # S3Service 인스턴스 생성
        self.client = anthropic.Anthropic(api_key=self.claude_key)
        self.logger = logging.getLogger(__name__)

    def convert_pdf_from_s3(self, presigned_url):
        try:
            # S3 presigned URL을 통해 PDF 파일 다운로드
            response = requests.get(presigned_url)
            self.logger.info("Downloading PDF from S3 URL: %s", presigned_url)
            
            if response.status_code != 200:
                self.logger.error("Failed to download PDF file from S3, Status Code: %s", response.status_code)
                raise Exception("Failed to download PDF file from S3")
            
            # 임시 파일에 PDF 저장
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_pdf:
                temp_pdf.write(response.content)
                temp_pdf_path = temp_pdf.name
            
            self.logger.info("PDF downloaded successfully to temp path: %s", temp_pdf_path)

            # Mathpix API 옵션 설정
            options = {
                "conversion_formats": {"docx": True, "tex.zip": True},
                "math_inline_delimiters": ["$", "$"],
                "rm_spaces": True
            }

            # Mathpix API 요청
            with open(temp_pdf_path, "rb") as pdf_file:
                r = requests.post(
                    "https://api.mathpix.com/v3/pdf",
                    headers={"app_id": self.app_id, "app_key": self.app_key},
                    data={"options_json": json.dumps(options)},
                    files={"file": pdf_file}
                )

            if r.status_code != 200:
                self.logger.error("Mathpix API request failed, Status Code: %s, Response: %s", r.status_code, r.text)
                raise Exception("Mathpix API request failed: " + r.text)

            self.logger.info("Mathpix API request successful")
            return r.json()
        
        except Exception as e:
            self.logger.error("Error in convert_pdf_from_s3: %s", traceback.format_exc())
            raise e

    def check_status(self, pdf_id):
        # Mathpix API로 PDF 변환 상태 확인
        url = f'https://api.mathpix.com/v3/pdf/{pdf_id}'
        headers = {
            'app_id': self.app_id,
            'app_key': self.app_key,
        }

        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise Exception("Failed to retrieve PDF status from Mathpix API")

        return response.json()
    
    def get_md(self, pdf_id):
        # Mathpix API로 PDF 변환 상태 확인
        url = f'https://api.mathpix.com/v3/pdf/{pdf_id}.md'
        headers = {
            'app_id': self.app_id,
            'app_key': self.app_key,
        }

        response = requests.get(url, headers=headers)
        
        # # 결과를 파일로 저장
        # with open(f"{pdf_id}.md", "w") as f:
        #     f.write(response.text)

        # 응답 내용을 반환
        return response.text

    def convert_pdf_and_check_status(self, key):
        # 1. S3 presigned URL 생성
        presigned_url = self.s3_service.get_presigned_url_for_read(key)["url"]

        # 2. PDF 변환 요청
        convert_response = self.convert_pdf_from_s3(presigned_url)
        pdf_id = convert_response.get("pdf_id")
        if not pdf_id:
            raise Exception("Failed to retrieve pdf_id from Mathpix API response")

        # 3. 변환 상태 확인 (폴링 방식)
        while True:
            status_response = self.check_status(pdf_id)
            status = status_response.get("status")
            
            if status == "completed":
                break
            else :
                # 완료 전이라면 기다렸다 추가 요청
                time.sleep(1)  
            
        status_response = self.parse_problem(self.get_md(pdf_id))
        #status_response = self.get_response_from_claude(self.get_md(pdf_id))


        return {"pdf_id": pdf_id, "status_response": status_response}
    
    def parse_problem(self,file):
        # 1. "숫자. " 패턴을 기준으로 전체 텍스트 분할
        questions = re.split(r'(?=\d+\.\s)', file.strip())
        questions = [q.strip() for q in questions if re.match(r'^\d+\.', q.strip())]

        # 2. 최종 결과를 저장할 배열 생성
        parsed_questions = []

        # 3. 각 항목에 대해 "##"로 세부 분할하여 하나의 배열에 담기
        for question in questions:
            if "##" in question:
                # "##"가 포함된 경우, 이를 기준으로 다시 분할하여 하위 항목을 추가
                sub_questions = re.split(r'(?=##)', question)
                parsed_questions.extend([sub_q.strip() for sub_q in sub_questions if sub_q.strip()])
            else:
                # "##"가 없는 경우는 그대로 추가
                parsed_questions.append(question)

        # 결과 출력
        for idx, item in enumerate(parsed_questions):
            print(f"항목 {idx + 1}: {item}\n")

        # 결과를 배열로 저장
        return parsed_questions
    
    def get_response_from_claude(self,file):
        result_text = ""
        question = file + "문제 번호를 기준으로 줄바꿈을 시켜줘. 각 보기 사이에도 줄바꿈을 넣어줘. 보기는 (숫자)의 형태로 있어. 원본 글에서 나눈 결과만 반환해줘."
        # Claude에 메시지 생성 요청을 보냅니다.
        response = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=8192,
            temperature=0.0,
            messages=[{"role": "user", "content": question}]
        )
        
        # 응답 객체에서 텍스트 내용만 추출합니다.
        if not response.content or not isinstance(response.content, list):
            result_text = "No response or unexpected response format."
        else:
            response_texts = [block.text for block in response.content if hasattr(block, 'text')]
            result_text = " ".join(response_texts)
    
        return result_text
