// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Client } = require("@elastic/elasticsearch");
import { NextResponse } from "next/server";

const client = new Client({
  requestTimeout: 600000,
  pingTimeout: 600000,
  nodes: ["https://10.112.204.101:9200"],
  auth: {
    username: "elastic",
    password: "Hae01@",
  },
  // sniffOnStart: true,
  tls: { rejectUnauthorized: false },
});
export async function POST(req) {
  // console.log(req.body.query);
  // const query = req.body.query;
  const body = await req.json();
  const { query } = body;
  try {
    const result = await client.sql.query({
      query,
      // request_timeout: "600s",
      // wait_for_completion_timeout: "600s",
      time_zone: "America/Los_Angeles",
    });
    console.log(result.rows.length);
    let cursotExist = false;
    let cursor = "";
    let cursorNumber = 0;
    if (result.hasOwnProperty("cursor")) {
      console.log("cursor exits");
      cursotExist = true;
      cursor = result["cursor"];
      while (cursotExist) {
        // console.log(cursorNumber)
        const nextResult = await client.sql.query({
          cursor,
        });
        result.rows = result.rows.concat(nextResult.rows);
        console.log(result.rows.length);

        if (!nextResult.hasOwnProperty("cursor")) {
          cursotExist = false;
        } else {
          cursor = nextResult["cursor"];
        }
        cursorNumber++;
      }
    }
    // console.log(result)
    console.log(result);
    return NextResponse.json(result);
  } catch (error) {
    // console.log(error)
    return NextResponse.error();
  }
}
