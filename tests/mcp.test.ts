import { describe, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "@/mcp/server";

async function connect() {
  const server = createServer();
  const client = new Client({ name: "test", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

describe("batchcook MCP server", () => {
  it("exposes the full tool registry", async () => {
    const client = await connect();
    const { tools } = await client.listTools();
    expect(tools.length).toBe(4);
    const names = new Set(tools.map((t) => t.name));
    for (const expected of ["scale_recipe", "to_fraction", "baker_percentages", "serving_factor"]) {
      expect(names.has(expected), expected).toBe(true);
    }
    await client.close();
  });

  it("scales a pasted recipe with kitchen fractions and egg notes", async () => {
    const client = await connect();
    const r = await client.callTool({
      name: "scale_recipe",
      arguments: {
        recipe: "2 cups flour\n3 eggs\nSalt to taste",
        factor: 0.5,
      },
    });
    const parsed = JSON.parse((r.content as any)[0].text);
    expect(parsed.factor).toBe(0.5);
    expect(parsed.lines[0].display).toBe("1 cup flour");
    expect(parsed.lines[1].display).toBe("2 eggs");
    expect(parsed.lines[1].note).toContain("1.5");
    expect(parsed.lines[2].display).toBe("Salt to taste");
    await client.close();
  });

  it("scales metric lines and rejects recipes without parseable amounts", async () => {
    const client = await connect();
    const r = await client.callTool({
      name: "scale_recipe",
      arguments: { recipe: "500g chicken\n2 cups flour", factor: 2 },
    });
    const parsed = JSON.parse((r.content as any)[0].text);
    expect(parsed.lines[0].display).toBe("1000 g chicken");
    expect(parsed.lines[1].display).toBe("4 cups flour");

    const bad = await client.callTool({
      name: "scale_recipe",
      arguments: { recipe: "Salt to taste\nfresh herbs", factor: 2 },
    });
    expect((bad as any).isError).toBe(true);
    expect((bad.content as any)[0].text).toContain("no ingredient lines");
    await client.close();
  });

  it("converts decimals to cooking fractions", async () => {
    const client = await connect();
    const half = await client.callTool({ name: "to_fraction", arguments: { value: 0.5 } });
    expect((half.content as any)[0].text).toContain("1/2");
    expect((half.content as any)[0].text).toContain("½");
    const third = await client.callTool({ name: "to_fraction", arguments: { value: 0.333 } });
    expect((third.content as any)[0].text).toContain("1/3");
    const improper = await client.callTool({ name: "to_fraction", arguments: { value: 1.5 } });
    expect((improper.content as any)[0].text).toContain("3/2");
    const none = await client.callTool({ name: "to_fraction", arguments: { value: 0.1, max_den: 8 } });
    expect((none as any).isError).toBe(true);
    await client.close();
  });

  it("computes baker's percentages against hand-computed grams", async () => {
    const client = await connect();
    const r = await client.callTool({
      name: "baker_percentages",
      arguments: {
        flour_g: 500,
        items: [
          { name: "water", pct: 65 },
          { name: "salt", pct: 2 },
        ],
      },
    });
    const parsed = JSON.parse((r.content as any)[0].text);
    expect(parsed.items[0].grams).toBe(325);
    expect(parsed.items[1].grams).toBe(10);
    expect(parsed.total_dough_g).toBe(835);
    await client.close();
  });

  it("derives the serving factor between two serving counts", async () => {
    const client = await connect();
    const r = await client.callTool({
      name: "serving_factor",
      arguments: { serves_original: 4, serves_target: 6 },
    });
    expect((r.content as any)[0].text).toContain("×1.5");
    const back = await client.callTool({
      name: "serving_factor",
      arguments: { serves_original: 6, serves_target: 4 },
    });
    expect((back.content as any)[0].text).toContain("×0.667");
    await client.close();
  });

  it("handles invalid input at two layers: schema (protocol error) and logic (isError)", async () => {
    const client = await connect();
    // schema 层:factor ≤ 0 被 zod 拒绝 → SDK 返回 isError 结果(不 throw)
    const schemaBad = await client.callTool({
      name: "scale_recipe",
      arguments: { recipe: "2 cups flour", factor: 0 },
    });
    expect((schemaBad as any).isError).toBe(true);
    expect((schemaBad.content as any)[0].text).toContain("-32602");
    // schema 层:负百分比
    const schemaBad2 = await client.callTool({
      name: "baker_percentages",
      arguments: { flour_g: 500, items: [{ name: "water", pct: -5 }] },
    });
    expect((schemaBad2 as any).isError).toBe(true);
    // schema 层:serving counts 非正数
    const schemaBad3 = await client.callTool({
      name: "serving_factor",
      arguments: { serves_original: 0, serves_target: 4 },
    });
    expect((schemaBad3 as any).isError).toBe(true);
    await client.close();
  });
});
