

import { getXataClient } from "./xata";

const client = getXataClient();

const DbClient = client.db

export default DbClient;