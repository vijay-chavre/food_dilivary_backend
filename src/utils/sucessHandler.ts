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
  return res.status(statusCode).json({
    statusCode,
    data,
  });
}
