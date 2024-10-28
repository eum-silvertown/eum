FROM openjdk:17-ea-11-jdk-slim

ARG JAR_FILE=build/libs/apigateway-service-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} apigateway-service.jar

ENTRYPOINT ["java", "-jar", "apigateway-service"]