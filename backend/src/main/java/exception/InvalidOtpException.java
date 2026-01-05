package exception;

import org.springframework.http.HttpStatus;

public class InvalidOtpException extends CustomException {
    public InvalidOtpException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}

