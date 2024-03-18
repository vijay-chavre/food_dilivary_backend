import { Request, Response } from 'express';
export interface CustomErrorType extends Error {
  errors(errors: any): unknown;
  statusCode?: number;
  code: number;
}

type error = {
  message: string;
  errorDetails?: CustomErrorType;
};

interface ErrorResponse {
  status: 'fail';
  statusCode: number;
  errors: error | error[];
}
const handleErrors = (err: CustomErrorType, res: Response) => {
  console.log(err);
  const errorResponse: ErrorResponse = {
    status: 'fail',
    statusCode: err.statusCode || 500,
    errors: {
      message: err.message,
      errorDetails: err,
    },
  };

  if (err instanceof CustomError) {
    errorResponse.statusCode = err.statusCode;
    return res.status(err.statusCode).json(errorResponse);
  }

  if (err.name === 'ValidationError') {
    errorResponse.errors = Object.values(err.errors).map((e) => ({
      message: e.message,
    }));

    errorResponse.statusCode = 400;

    return res.status(400).json(errorResponse);
  }

  if (err.code === 11000) {
    errorResponse.errors = {
      message: 'Duplicate field value entered',
    };
    errorResponse.statusCode = 400;

    return res.status(400).json(errorResponse);
  }

  if (err.name === 'UnauthorizedError') {
    // JWT validation error
    errorResponse.errors = {
      message: 'Invalid token',
    };
    errorResponse.statusCode = 400;

    return res.status(400).json(errorResponse);
  }

  return res.status(errorResponse.statusCode).json(errorResponse);
};

class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { CustomError };
export default handleErrors;
