package com.eum.apigatewayservice.exception;

import static org.springframework.http.MediaType.APPLICATION_JSON;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Order(-2)
@Component
class GlobalExceptionHandler implements ErrorWebExceptionHandler {

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        ErrorResponse errorResponse = null;
        DataBuffer dataBuffer = null;

        DataBufferFactory bufferFactory = exchange.getResponse().bufferFactory();

        exchange.getResponse().getHeaders().setContentType(APPLICATION_JSON);

        ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
        if (ex instanceof EumException) {
            errorCode = ((EumException) ex).getErrorCode();
        }
        errorResponse = ErrorResponse.create(errorCode);

        try {
            dataBuffer =
                    bufferFactory.wrap(objectMapper.writeValueAsBytes(errorResponse));
        } catch (JsonProcessingException e) {
            bufferFactory.wrap("".getBytes());
        }

        exchange.getResponse().setStatusCode(errorCode.getHttpStatus());

        return exchange.getResponse().writeWith(Mono.just(dataBuffer));
//        return null;
    }
}



