package com.eum.user_service.domain.mail.service;

import com.eum.user_service.domain.mail.dto.EmailAuthCheckRequest;
import com.eum.user_service.domain.mail.dto.EmailAuthRequest;
import com.eum.user_service.domain.mail.dto.FindIdResponse;
import com.eum.user_service.domain.mail.dto.FindPasswordRequest;
import com.eum.user_service.domain.mail.entity.EmailValidationCode;
import com.eum.user_service.domain.mail.repository.EmailValidationCodeRepository;
import com.eum.user_service.domain.user.entity.Member;
import com.eum.user_service.domain.user.repository.UserRepository;
import com.eum.user_service.global.exception.ErrorCode;
import com.eum.user_service.global.exception.EumException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService{

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final EmailValidationCodeRepository emailValidationCodeRepository;

    @Override
    public void emailAuthentication(EmailAuthRequest emailAuthRequest) {
        if(userRepository.existsByEmail(emailAuthRequest.email())) {
            throw new EumException(ErrorCode.EMAIL_ALREADY_EXISTED);
        }
        saveAuthenticationCodeAndSendMessage(emailAuthRequest.email());
    }

    @Override
    public void emailAuthenticationForFindId(EmailAuthRequest emailAuthRequest) {
        if(!userRepository.existsByEmail(emailAuthRequest.email())) {
            throw new EumException(ErrorCode.USER_NOT_FOUND);
        }
        saveAuthenticationCodeAndSendMessage(emailAuthRequest.email());
    }

    @Override
    public void emailAuthenticationForFindPassword(FindPasswordRequest findPasswordRequest) {
        if(!userRepository.existsByUserIdAndEmail(findPasswordRequest.id(),findPasswordRequest.email())) {
            throw new EumException(ErrorCode.USER_NOT_FOUND);
        }
        saveAuthenticationCodeAndSendMessage(findPasswordRequest.email());
    }

    @Override
    public void checkAuthenticationCode(EmailAuthCheckRequest emailAuthCheckRequest) {
        validateAuthenticationCode(emailAuthCheckRequest);
    }

    @Override
    public FindIdResponse findIdWithAuthentication(EmailAuthCheckRequest emailAuthCheckRequest) {
        validateAuthenticationCode(emailAuthCheckRequest);
        Member member = userRepository.findByEmail(emailAuthCheckRequest.email())
                .orElseThrow(() -> new EumException(ErrorCode.USER_NOT_FOUND));
        emailValidationCodeRepository.deleteById(emailAuthCheckRequest.email());
        return FindIdResponse.from(member);
    }

    private void validateAuthenticationCode(EmailAuthCheckRequest emailAuthCheckRequest) {
        EmailValidationCode emailValidationCode = emailValidationCodeRepository.findById(emailAuthCheckRequest.email())
                .orElseThrow(() -> new EumException(ErrorCode.EMAIL_AUTHENTICATION_CODE_EXPIRED));
        if(!emailValidationCode.getValidationCode().equals(emailAuthCheckRequest.code()))
            throw new EumException(ErrorCode.INVALID_EMAIL_AUTHENTICATION_CODE);
    }

    private void saveAuthenticationCodeAndSendMessage(String email) {
        String code = sendSimpleMessage(email);
        emailValidationCodeRepository.save(EmailValidationCode.of(email,code));
    }

    // 랜덤으로 숫자 생성
    private String createCode() {
        Random random = new Random();
        StringBuilder key = new StringBuilder();

        for (int i = 0; i < 6; i++) { // 코드 6자리
            int index = random.nextInt(3);

            switch (index) {
                case 0 -> key.append((char) (random.nextInt(26) + 97)); // 소문자
                case 1 -> key.append((char) (random.nextInt(26) + 65)); // 대문자
                case 2 -> key.append(random.nextInt(10)); // 숫자
            }
        }
        return key.toString();
    }

    private MimeMessage createMail(String email, String code) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        message.setFrom("eum@eum.com");
        message.setRecipients(MimeMessage.RecipientType.TO, email);
        message.setSubject("Eum 인증코드입니다");
        String body = "";
        body += "<h3>요청하신 인증 코드입니다.</h3>";
        body += "<h1>" + code + "</h1>";
        body += "<h3>감사합니다.</h3>";
        message.setText(body, "UTF-8", "html");

        return message;
    }

    // 메일 발송
    private String sendSimpleMessage(String email) {
        String code = createCode();
        try {
            MimeMessage message = mailSender.createMimeMessage();
            message.setRecipients(MimeMessage.RecipientType.TO, email);
            message.setSubject("Eum 인증코드입니다");
            String body = "";
            body += "<h3>요청하신 인증 코드입니다.</h3>";
            body += "<h1>" + code + "</h1>";
            body += "<h3>감사합니다.</h3>";
            message.setText(body, "UTF-8", "html");
            mailSender.send(message);
        } catch (MailException | MessagingException e) {
            throw new EumException(ErrorCode.MESSAGE_SEND_FAILED);
        }

        return code;
    }

}
