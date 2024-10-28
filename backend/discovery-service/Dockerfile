FROM openjdk:17-ea-11-jdk-slim

ARG JAR_FILE=build/libs/discovery-service-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} discovery-service.jar

ENTRYPOINT ["java", "-jar", "discovery-service.jar"]