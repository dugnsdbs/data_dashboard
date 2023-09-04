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
    console.log(result.rows.length);
    let cursorExist = false;
    let cursor = "";
    let cursorNumber = 0;

    console.log("result.hasOwnProperty(cursor)");
    console.log(result.hasOwnProperty("cursor"));

    if (result.hasOwnProperty("cursor")) {
      console.log("cursor exist");
      cursorExist = true;
      cursor = result["cursor"];
      console.log("corsor first");
      console.log(cursor);

      while (cursorExist) {
        // console.log(cursorNumber)
        const nextResult = await client.sql.query({
          cursor,
        });
        console.log("Nextresult");
        console.log(nextResult);
        console.log("Nextresult row");
        console.log(nextResult.rows);
        result.rows = result.rows.concat(nextResult.rows);
        console.log(result.rows);
        console.log(result.rows.length);

        if (!nextResult.hasOwnProperty("cursor")) {
          cursorExist = false;
        } else {
          cursor = nextResult["cursor"];
          console.log("last cursor");
          console.log(cursor);
        }
        cursorNumber++;
        console.log(cursorNumber);
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
