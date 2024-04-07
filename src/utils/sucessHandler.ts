import { Response } from 'express';

/**
 * Sends a success response with the given data.
 * @param res The response object.
 * @param data The data to send.
 * @param statusCode The status code to send. Defaults to 200.
 * @returns The response object.
 */
export default function sendSuccess(
  res: Response,
  data: unknown,
  statusCode: number = 200
): Express.Response {
  const apiResponse = new ApiResponse(statusCode, data, 'Success');
  if (
    typeof data === 'object' &&
    data !== null &&
    'accessToken' in data &&
    'refreshToken' in data
  ) {
    const { accessToken, refreshToken } = data;

    return res
      .status(statusCode)
      .cookie('accessToken', accessToken)
      .cookie('refreshToken', refreshToken)
      .json(apiResponse);
  }
  return res.status(statusCode).json(apiResponse);
}

class ApiResponse {
  statusCode: number;
  data: unknown;
  message: string;
  success: boolean;
  constructor(statusCode: number, data: unknown, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
