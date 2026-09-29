import { describe, expect, it } from "vitest";
import { GetDbUserId } from "./user-action";
import { mockAuthenticated, mockDbUser, prismaMock } from "@/test/mocks";

describe("GetDbUserId", () => {
  it("devolve undefined quando não há utilizador autenticado", async () => {
    mockAuthenticated(null);

    await expect(GetDbUserId()).resolves.toBeUndefined();
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("devolve undefined quando o utilizador do Clerk não existe na base de dados", async () => {
    mockDbUser("clerk_1", null);

    await expect(GetDbUserId()).resolves.toBeUndefined();
  });

  it("devolve o id da base de dados do utilizador autenticado", async () => {
    mockDbUser("clerk_1", "db_1");

    await expect(GetDbUserId()).resolves.toBe("db_1");
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { clerkid: "clerk_1" } }),
    );
  });
});
