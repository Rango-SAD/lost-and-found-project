package service;

import controller.dto.LoginRequest;
import controller.dto.RegisterRequest;
import exception.InvalidCredentialsException;
import exception.UserAlreadyExistsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service.entity.User;
import service.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public String register(RegisterRequest request) {
        log.info("Registering new user username={}, email={}", request.getUsername(), request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("User with this email already exists");
        }
        if (userRepository.existsByName(request.getUsername())) {
            throw new UserAlreadyExistsException("User with this username already exists");
        }

        User user = new User();
        user.setName(request.getUsername()); // username -> name
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with id={}", savedUser.getId());

        return jwtService.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getName());
    }

    @Transactional(readOnly = true)
    public String login(LoginRequest request) {
        log.info("Login attempt username={}", request.getUsername());

        User user = userRepository.findByName(request.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Invalid password attempt username={}", request.getUsername());
            throw new InvalidCredentialsException("Invalid username or password");
        }

        log.info("User logged in successfully username={}, email={}", user.getName(), user.getEmail());
        return jwtService.generateToken(user.getId(), user.getEmail(), user.getName());
    }
}