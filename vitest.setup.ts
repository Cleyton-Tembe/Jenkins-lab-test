import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

// Variáveis que os módulos leem no momento do import.
process.env.DB_URL ??= "postgresql://test:test@localhost:5432/test";

// --- Mocks globais -------------------------------------------------------
// Factories assíncronas: evitam problemas de hoisting do vi.mock.

vi.mock("@/lib/prisma", async () => {
  const { prismaMock } = await import("./src/test/mocks");
  return { prisma: prismaMock };
});

vi.mock("@clerk/nextjs/server", async () => {
  const { authMock, currentUserMock } = await import("./src/test/mocks");
  return { auth: authMock, currentUser: currentUserMock };
});

vi.mock("next/cache", async () => {
  const { revalidatePathMock } = await import("./src/test/mocks");
  return { revalidatePath: revalidatePathMock };
});

// --- Limpeza entre testes ------------------------------------------------
beforeEach(async () => {
  const { resetAllMocks } = await import("./src/test/mocks");
  resetAllMocks();
});

afterEach(() => {
  cleanup();
});
