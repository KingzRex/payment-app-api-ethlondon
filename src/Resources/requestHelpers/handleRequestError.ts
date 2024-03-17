import { Response } from "express";
import { isHttpError } from "../exceptions/HttpExceptions";
import { INTERNAL_SERVER_ERROR } from "../Constants/StatusCodes";
import { isAxiosError } from "axios";

const isDefaultError = (error: unknown): error is Error => {
  return error instanceof Error;
};

const handleRequestError = (error: unknown, response: Response, logOnly?: true) => {
  const parsedError = parseUnknownError(error);

  console.log(`Error: ${JSON.stringify(parsedError, null, 4)}`);

  return response.status(parsedError.statusCode ?? INTERNAL_SERVER_ERROR).send({ message: parsedError.message });
};

interface ParsedError {
  data?: unknown;
  statusCode?: number;
  code?: string;
  message: string;
  stack?: string;
  cause?: unknown;
  name: string;
}

const parseUnknownError = (error: unknown): ParsedError => {
  const parsedError: ParsedError = {
    message: "",
    name: "",
  };

  if (isAxiosError(error)) {
    parsedError["data"] = {
      errorResponse: error.response?.data,
      requestConfig: {
        data: error.config?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        params: error.config?.params,
        headers: error.config?.headers,
      },
    };
    parsedError["cause"] = error.cause;
    parsedError["statusCode"] = error.response?.status ?? error.status;
    parsedError["message"] = error.message;
    parsedError["code"] = error.code;
    parsedError["stack"] = error.stack;
    parsedError["name"] = error.name;

    return parsedError;
  } else if (isHttpError(error)) {
    parsedError["message"] = error.message;
    parsedError["statusCode"] = error.status;
    parsedError["stack"] = error.stack;
    parsedError["data"] = error.data;
    parsedError["cause"] = error.cause;
    parsedError["code"] = "ERR_HTTP_REQUEST_ERROR";
    parsedError["name"] = error.name;

    return parsedError;
  } else if (isDefaultError(error)) {
    parsedError["message"] = error.message;
    parsedError["statusCode"] = INTERNAL_SERVER_ERROR;
    parsedError["stack"] = error.stack;
    parsedError["data"] = "";
    parsedError["cause"] = error.cause;
    parsedError["code"] = "ERR_HTTP_REQUEST_ERROR";
    parsedError["name"] = error.name;

    return parsedError;
  } else {
    parsedError["message"] = (error as Error).message ?? "An unknown error occurred";
    parsedError["statusCode"] = INTERNAL_SERVER_ERROR;
    parsedError["code"] = "ERR_UNKNOWN_ERROR";
    parsedError["stack"] = (error as Error).stack;
    parsedError["cause"] = (error as Error).cause;
    parsedError["name"] = (error as Error).name;

    return parsedError;
  }
};

export { handleRequestError, parseUnknownError };
