export default function sendSuccess(res, data, statusCode = 200) {
  res.status(statusCode).json({
    status: 'success',
    statusCode,
    data
  });
}

