// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Client } = require("@elastic/elasticsearch");
import { NextResponse } from "next/server";

const client = new Client({
  requestTimeout: 600000,
  pingTimeout: 600000,
  nodes: [process.env.ELK_URL],
  auth: {
    username: process.env.ELK_USERNAME,
    password: process.env.ELK_PASSWORD,
  },
  // sniffOnStart: true,
  tls: { rejectUnauthorized: false },
});
export async function POST(req) {
  const body = await req.json();
  const { query } = body;
  try {
    const result = await client.sql.query({
      query,
      // request_timeout: "600s",
      // wait_for_completion_timeout: "600s",
      time_zone: "America/Los_Angeles",
    });
    let cursorExist = false;
    let cursor = "";
    let cursorNumber = 0;

    if (result.hasOwnProperty("cursor")) {
      console.log("cursor exist");
      cursorExist = true;
      cursor = result["cursor"];

      while (cursorExist) {
        const nextResult = await client.sql.query({
          cursor,
        });
        result.rows = result.rows.concat(nextResult.rows);
        console.log(result.rows.length);

        if (!nextResult.hasOwnProperty("cursor")) {
          cursorExist = false;
        } else {
          cursor = nextResult["cursor"];
        }
        cursorNumber++;
      }
    }
    return NextResponse.json(result);
  } catch (error) {
    // console.log(error)
    return NextResponse.error();
  }
}
