
import { CorsOptions } from 'cors';
import AllowedOrigins, { allowedOriginPatterns } from './AllowedOrigins';
import { APP_ENV } from '../Constants/env';

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (APP_ENV === "development") {
      callback(null, true);

      return;
    }

    const isAllowedOrigin = AllowedOrigins.indexOf(origin!) !== -1 || !origin;
    const matchesPattern = origin && allowedOriginPatterns.some((pattern) => pattern.test(origin));

    if (isAllowedOrigin || matchesPattern) {
      callback(null, true);
    } else {
      callback(new Error(`${origin} is Not allowed by CORS`));
    }
  },

  optionsSuccessStatus: 200,
  credentials: true,
};

export default corsOptions;
