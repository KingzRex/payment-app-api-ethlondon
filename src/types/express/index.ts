import { Request } from "express";
import { UserRecord } from "../../Db/xata";

declare global {
  namespace Express {
    export interface Request {
      user?: UserRecord;
      rawBody: string;
    }
  }

  export type RequestWithBody<B> = Request<Request["params"], Request["res"], B>;
  export type RequestWithParams<P> = Request<P, Request["res"], Request["body"]>;
  export type RequestWithQuery<Q> = Request<Request["params"], Request["res"], Request["body"], Q>;
}
