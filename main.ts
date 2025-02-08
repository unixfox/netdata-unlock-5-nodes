import { Hono } from "hono";
import "jsr:@std/dotenv/load";

const app = new Hono();

app.get("/api/v3/settings", async (c) => {
  const registeredNodes = await fetch(
    `${
      Deno.env.get("NETDATA_BASE_URL") || "http://localhost:19999"
    }/api/v1/registry?action=hello`,
    {
      headers: {
        ...c.req.header(),
      },
    },
  );
  const originalBody = await fetch(
    `${
      Deno.env.get("NETDATA_BASE_URL") || "http://localhost:19999"
    }/api/v3/settings?file=default`,
    {
      headers: {
        ...c.req.header(),
      },
    },
  );
  const registeredNodesJson = await registeredNodes.json();
  const originalBodyJson = await originalBody.json();
  originalBodyJson.value.preferred_node_ids = [];
  for (const registeredNode of registeredNodesJson.nodes) {
    originalBodyJson.value.preferred_node_ids.push(registeredNode.machine_guid);
  }
  return c.json(originalBodyJson);
});

app.get("*", async (c) => {
  const res = await fetch(
    `${
      Deno.env.get("NETDATA_BASE_URL") || "http://localhost:19999"
    }${c.req.path}${URL.parse(c.req.url)?.search}`,
    {
      headers: {
        ...c.req.header(),
      },
    },
  );
  return res;
});

Deno.serve({
  port: Number(Deno.env.get("PORT")) || 8000,
  hostname: Deno.env.get("HOST") || "::",
}, app.fetch);
