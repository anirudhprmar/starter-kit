import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
      BETTER_AUTH_SECRET: z.string(),
      BETTER_AUTH_URL: z.url(),
      AUTH_GOOGLE_ID: z.string(),
      AUTH_GOOGLE_SECRET: z.string(),
      GEMINI_API_KEY:z.string(),
      MISTRAL_API_KEY:z.string(),
      // OPENAI_API_KEY:z.string(),
      // REPLICATE_API_KEY:z.string(),
      RESEND_API_KEY:z.string(),
      POLAR_ACCESS_TOKEN:z.string(),
      POLAR_WEBHOOK_SECRET:z.string(),
      POLAR_SUCCESS_URL:z.url(),
      R2_UPLOAD_IMAGE_ACCESS_KEY_ID:z.string(),
      R2_UPLOAD_IMAGE_SECRET_ACCESS_KEY:z.string(),
      CLOUDFLARE_ACCOUNT_ID:z.string(),
      R2_UPLOAD_IMAGE_BUCKET_NAME:z.string(),
      R2_PUBLIC_BASE_URL:z.url(),
      UPSTASH_REDIS_REST_URL: z.url(),
      UPSTASH_REDIS_REST_TOKEN: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.url(),
    NEXT_PUBLIC_STARTER_TIER: z.string(),
    NEXT_PUBLIC_STARTER_SLUG: z.string(),
    NEXT_PUBLIC_LIFETIME_TIER:z.string(),
    NEXT_PUBLIC_LIFETIME_SLUG:z.string()
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL:process.env.BETTER_AUTH_URL,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    GEMINI_API_KEY:process.env.GEMINI_API_KEY,
    MISTRAL_API_KEY:process.env.MISTRAL_API_KEY,
    // OPENAI_API_KEY:process.env.OPENAI_API_KEY,
    // REPLICATE_API_KEY:process.env.REPLICATE_API_KEY,
    RESEND_API_KEY:process.env.RESEND_API_KEY,
    POLAR_ACCESS_TOKEN:process.env.POLAR_ACCESS_TOKEN,
    POLAR_WEBHOOK_SECRET:process.env.POLAR_WEBHOOK_SECRET,
    POLAR_SUCCESS_URL:process.env.POLAR_SUCCESS_URL,
    NEXT_PUBLIC_STARTER_TIER: process.env.NEXT_PUBLIC_STARTER_TIER,
    NEXT_PUBLIC_STARTER_SLUG: process.env.NEXT_PUBLIC_STARTER_SLUG,
    NEXT_PUBLIC_LIFETIME_TIER:process.env.NEXT_PUBLIC_LIFETIME_TIER,
    NEXT_PUBLIC_LIFETIME_SLUG:process.env.NEXT_PUBLIC_LIFETIME_SLUG,
    R2_UPLOAD_IMAGE_ACCESS_KEY_ID: process.env.R2_UPLOAD_IMAGE_ACCESS_KEY_ID,
    R2_UPLOAD_IMAGE_SECRET_ACCESS_KEY: process.env.R2_UPLOAD_IMAGE_SECRET_ACCESS_KEY,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    R2_UPLOAD_IMAGE_BUCKET_NAME: process.env.R2_UPLOAD_IMAGE_BUCKET_NAME,
    R2_PUBLIC_BASE_URL: process.env.R2_PUBLIC_BASE_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
