import { z } from "zod";
import { archiveProduct, createProduct, listProducts, listSettings, listSiteImages, setSiteSetting, updateProduct } from "./db";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "../shared/const";

const productSchema = z.object({ slug: z.string().min(2).max(128), nameAr: z.string().min(1).max(255), nameEn: z.string().max(255).optional().nullable(), descriptionAr: z.string().optional().nullable(), descriptionEn: z.string().optional().nullable(), category: z.string().min(1).max(64), price: z.number().int().nonnegative(), currency: z.string().min(3).max(8).default("EGP"), options: z.record(z.string(), z.unknown()).optional().nullable(), imageSlot: z.string().max(128).optional().nullable(), isVisible: z.boolean().default(true), isArchived: z.boolean().default(false), sortOrder: z.number().int().default(0) });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  publicSite: router({
    products: publicProcedure.query(() => listProducts(true)),
    settings: publicProcedure.query(() => listSettings()),
    images: publicProcedure.query(() => listSiteImages()),
  }),
  admin: router({
    dashboard: adminProcedure.query(async () => ({ products: await listProducts(false), settings: await listSettings(), images: await listSiteImages() })),
    products: router({
      list: adminProcedure.query(() => listProducts(false)),
      create: adminProcedure.input(productSchema).mutation(({ input }) => createProduct(input)),
      update: adminProcedure.input(z.object({ id: z.number().int().positive(), data: productSchema.partial() })).mutation(({ input }) => updateProduct(input.id, input.data)),
      archive: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => archiveProduct(input.id)),
    }),
    settings: router({
      list: adminProcedure.query(() => listSettings()),
      save: adminProcedure.input(z.object({ key: z.string().min(1).max(128), group: z.string().min(1).max(64), value: z.string() })).mutation(({ ctx, input }) => setSiteSetting(input.key, input.group, input.value, ctx.user.id)),
    }),
    images: router({ list: adminProcedure.query(() => listSiteImages()) }),
  }),
});
export type AppRouter = typeof appRouter;
