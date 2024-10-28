# 빌드 단계
FROM gradle:7.6-jdk17 AS builder
WORKDIR /app
COPY . .
RUN ./gradlew clean build --no-daemon

# 실행 단계
FROM openjdk:17-alpine
# 타임존 설정
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

# 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar /app/discovery-service.jar

# 컨테이너에서 사용하는 포트 명시
EXPOSE 8761

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "-Duser.timezone=Asia/Seoul", "/app/discovery-service.jar"]
