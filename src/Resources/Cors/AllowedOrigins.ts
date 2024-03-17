const allowedOrigins = [
    'http://localhost:3000',
];

export const allowedOriginPatterns = [
  /^http:\/\/localhost:(\d)+$/,
  /.+\.local$/,
  // Add other patterns as needed
];

export default allowedOrigins;
