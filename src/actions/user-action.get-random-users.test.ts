import { describe, expect, it } from "vitest";
import { GetRandomUsers } from "./user-action";
import { mockDbUser, prismaMock } from "@/test/mocks";

describe("GetRandomUsers", () => {
  const users = [
    {
      id: "db_2",
      name: "Ana",
      username: "ana",
      image: null,
      _count: { followers: 4 },
    },
    {
      id: "db_3",
      name: "Bruno",
      username: "bruno",
      image: null,
      _count: { followers: 9 },
    },
  ];

  it("devolve no máximo 3 utilizadores, excluindo o próprio e os já seguidos", async () => {
    mockDbUser("clerk_1", "db_1");
    prismaMock.user.findMany.mockResolvedValue(users);

    await expect(GetRandomUsers()).resolves.toEqual(users);

    const args = prismaMock.user.findMany.mock.calls[0][0];
    expect(args.take).toBe(3);
    expect(args.where.AND[0]).toEqual({ NOT: { id: "db_1" } });
    expect(args.where.AND[1]).toEqual({
      NOT: { followers: { some: { followerId: "db_1" } } },
    });
  });

  it("devolve uma lista vazia quando a consulta falha", async () => {
    mockDbUser("clerk_1", "db_1");
    prismaMock.user.findMany.mockRejectedValue(new Error("db down"));

    await expect(GetRandomUsers()).resolves.toEqual([]);
  });
});
