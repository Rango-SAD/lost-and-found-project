package service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final JavaMailSender mailSender;

    @Value("${otp.length:6}")
    private int otpLength;

    @Value("${otp.expiration:300}")
    private long otpExpirationSeconds;

    @Value("${otp.redis-key-prefix:otp:}")
    private String redisKeyPrefix;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private static final String OTP_CHARACTERS = "0123456789";
    private final SecureRandom random = new SecureRandom();

    private String generateOtp() {
        StringBuilder otp = new StringBuilder(otpLength);
        for (int i = 0; i < otpLength; i++) {
            otp.append(OTP_CHARACTERS.charAt(random.nextInt(OTP_CHARACTERS.length())));
        }
        return otp.toString();
    }

    private void storeOtp(String email, String otp) {
        String key = redisKeyPrefix + email;
        redisTemplate.opsForValue().set(key, otp, otpExpirationSeconds, TimeUnit.SECONDS);
        log.info("OTP stored for email: {} with expiration: {} seconds", email, otpExpirationSeconds);
    }


    private void sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Your OTP Code for Registration");
            message.setText(buildEmailContent(otp));

            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send OTP email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }

    private String buildEmailContent(String otp) {
        return String.format("""
                Hello,
                
                Your OTP code for registration is: %s
                
                This code will expire in %d minutes.
                
                If you did not request this code, please ignore this email.
                
                Best regards,
                Lost and Found Team
                """, otp, otpExpirationSeconds / 60);
    }

    public void generateAndSendOtp(String email) {
        String otp = generateOtp();

        storeOtp(email, otp);

        sendOtpEmail(email, otp);

        log.info("OTP generated and sent successfully for email: {}", email);
    }

    public boolean verifyOtp(String email, String otp) {
        String key = redisKeyPrefix + email;
        Object storedOtp = redisTemplate.opsForValue().get(key);

        if (storedOtp == null) {
            log.warn("OTP not found or expired for email: {}", email);
            return false;
        }

        boolean isValid = storedOtp.toString().equals(otp);

        if (isValid) {
            redisTemplate.delete(key);
            log.info("OTP verified and deleted for email: {}", email);
        } else {
            log.warn("Invalid OTP provided for email: {}", email);
        }

        return isValid;
    }

}

