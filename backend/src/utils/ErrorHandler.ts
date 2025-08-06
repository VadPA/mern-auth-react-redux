class ErrorHandler extends Error {
  statusCode: Number;
  status: string;

  constructor(message: any, statusCode: Number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;