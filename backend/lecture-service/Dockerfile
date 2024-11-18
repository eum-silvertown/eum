FROM gradle:7.6-jdk17 AS builder
WORKDIR /app
COPY . .
RUN chmod +x gradlew && \
    ./gradlew clean build -x test --no-daemon

# 실행 단계
FROM openjdk:17-alpine
# 타임존 설정
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

# 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar /app/service.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "-Duser.timezone=Asia/Seoul", "/app/service.jar"]