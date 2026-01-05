package controller;

import controller.dto.SendOtpRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import service.OtpService;

@RestController
@RequestMapping("/api/public/auth")
@RequiredArgsConstructor
@Slf4j
@Validated
@Tag(name = "Authentication", description = "Authentication and OTP management endpoints")
public class OtpController {

    private final OtpService otpService;

    @PostMapping("/send-otp")
    @Operation(summary = "Send OTP to email", description = "Generates and sends a 6-digit OTP code to the specified email address")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OTP sent successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid email format"),
            @ApiResponse(responseCode = "500", description = "Failed to send OTP")
    })
    public ResponseEntity<Void> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        log.info("Received OTP request for email: {}", request.getEmail());


        otpService.generateAndSendOtp(request.getEmail());

        log.info("OTP sent successfully to: {}", request.getEmail());
        return ResponseEntity.ok().build();

    }

}
