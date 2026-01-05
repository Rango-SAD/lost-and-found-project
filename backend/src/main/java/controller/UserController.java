package controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import service.JwtService;
import controller.dto.LoginRequest;
import controller.dto.RegisterRequest;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.UserService;

@RestController
@RequestMapping("/api/")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User Management", description = "APIs for user registration, authentication, and logout")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    @Value("${jwt.cookie-secure:false}")
    private boolean cookieSecure;

    @PostMapping("public/register")
    @Operation(summary = "Register a new user", description = "Creates a new user account and returns a JWT token in a cookie")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or user already exists"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        log.info("Register request received for email: {}", request.getEmail());
        String jwtCookie = userService.register(request);

        // Set JWT cookie
        setJwtCookie(response, jwtCookie);

        return ResponseEntity.ok().build();
    }

    @PostMapping("public/login")
    @Operation(summary = "User login", description = "Authenticates a user and returns a JWT token in a cookie")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        log.info("Login request received for email: {}", request.getEmail());
        String jwtCookie = userService.login(request);

        // Set JWT cookie
        setJwtCookie(response, jwtCookie);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Logs out the user by clearing the JWT cookie")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Logout successful"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<String> logout(HttpServletResponse response) {
        log.info("Logout request received");

        // Clear JWT cookie
        Cookie cookie = new Cookie(jwtService.getCookieName(), null);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok("Logged out successfully");
    }

    private void setJwtCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(jwtService.getCookieName(), token);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/");
        cookie.setMaxAge((int) (jwtService.getJwtExpiration() / 1000)); // Convert to seconds
        response.addCookie(cookie);
    }
}

