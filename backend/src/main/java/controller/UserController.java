package controller;

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
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    @Value("${jwt.cookie-secure:false}")
    private boolean cookieSecure;

    @PostMapping("public/register")
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
    public ResponseEntity<Void> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        log.info("Login request received for email: {}", request.getEmail());
        String jwtCookie = userService.login(request);

        // Set JWT cookie
        setJwtCookie(response, jwtCookie);

        return ResponseEntity.ok().build();
    }

    @PostMapping("public/logout")
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

