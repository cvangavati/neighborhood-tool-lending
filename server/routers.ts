import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { z } from "zod";

const toolInput = z.object({
  communityId: z.string().min(1).max(128), name: z.string().trim().min(1).max(255), category: z.string().trim().min(1).max(64), description: z.string().trim().min(1).max(2000), status: z.enum(["available", "borrowed"]).default("available"), icon: z.string().min(1).max(64), accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  tools: router({
    list: protectedProcedure.input(z.object({ communityId: z.string().min(1).max(128) })).query(({ input }) => db.listToolsForCommunity(input.communityId)),
    create: protectedProcedure.input(toolInput).mutation(({ ctx, input }) => db.createTool({ ...input, ownerId: ctx.user.id })),
    updateOwned: protectedProcedure.input(z.object({ id: z.number().int().positive(), name: z.string().trim().min(1).max(255).optional(), category: z.string().trim().min(1).max(64).optional(), description: z.string().trim().min(1).max(2000).optional(), status: z.enum(["available", "borrowed"]).optional() })).mutation(({ ctx, input }) => { const { id, ...data } = input; return db.updateOwnedTool(id, ctx.user.id, data); }),
    mine: protectedProcedure.query(({ ctx }) => db.listToolsForCommunity(`owner:${ctx.user.id}`)),
  }),
  wishlist: router({
    list: protectedProcedure.query(({ ctx }) => db.listWishlistForUser(ctx.user.id)),
    add: protectedProcedure.input(z.object({ toolId: z.number().int().positive() })).mutation(({ ctx, input }) => db.addWishlistEntry(ctx.user.id, input.toolId)),
    remove: protectedProcedure.input(z.object({ toolId: z.number().int().positive() })).mutation(({ ctx, input }) => db.removeWishlistEntry(ctx.user.id, input.toolId)),
  }),
});

export type AppRouter = typeof appRouter;
