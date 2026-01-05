package controller.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
// DTO Classes
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Request to send OTP to email")
    public class SendOtpRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        @Schema(description = "Email address to send OTP", example = "user@example.com")
        private String email;
    }