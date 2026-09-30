import { mockDeep, mockReset, type DeepMockProxy } from "vitest-mock-extended";
import { vi } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaLike = Record<string, any>;
export const prismaMock: DeepMockProxy<PrismaLike> = mockDeep<PrismaLike>();

/** Mocks do Clerk. */
export const authMock = vi.fn();
export const currentUserMock = vi.fn();

/** Mock do revalidatePath do Next. */
export const revalidatePathMock = vi.fn();

/** Simula um utilizador autenticado no Clerk. */
export function mockAuthenticated(clerkId: string | null) {
  authMock.mockResolvedValue({ userId: clerkId });
}

/** Simula o par Clerk -> utilizador na base de dados usado por GetDbUserId(). */
export function mockDbUser(clerkId: string | null, dbUserId: string | null) {
  mockAuthenticated(clerkId);
  prismaMock.user.findUnique.mockResolvedValue(
    dbUserId ? { id: dbUserId, clerkid: clerkId } : null,
  );
}

export function resetAllMocks() {
  mockReset(prismaMock);
  authMock.mockReset();
  currentUserMock.mockReset();
  revalidatePathMock.mockReset();
}
