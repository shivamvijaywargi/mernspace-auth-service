import request from "supertest";

import app from "@/app";

describe.skip("First test", () => {
  it("Should check true is equal to true", () => {
    expect(true).toBe(true);
  });

  it("Should return 200 status code", async () => {
    const resp = await request(app).get("/health-check").send();

    expect(resp.statusCode).toBe(200);
  });
});
