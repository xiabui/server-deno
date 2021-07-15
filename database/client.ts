import { Client } from "https://deno.land/x/mysql/mod.ts";
import { DATABASE, TABLE } from "./config.ts";

const client = await new Client();

client.connect({
  hostname: "127.0.0.1",
  username: "root",
  password: "",
  port: 3306,
  db: DATABASE,
});

export default client;