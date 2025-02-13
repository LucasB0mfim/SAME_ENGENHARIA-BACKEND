class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
        // Captura o stack trace (útil para depuração)
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;