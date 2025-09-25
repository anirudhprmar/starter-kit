import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({

  getUser: publicProcedure
    .input(
      z
        .object({
          id: z.string().optional(),
        })
    )
    .query(async ({ ctx, input }) => {
      const record = await ctx.db.query.user.findFirst({
        where: (u, { eq, or }) => {
          if (input.id ) {
            return or(eq(u.id, input.id));
          }
        },
      });

      return record ?? null;
    }),
});
