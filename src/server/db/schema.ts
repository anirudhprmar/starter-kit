// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `starter-kit_${name}`);

export const user = createTable(
  "user",
  (d) => ({
    id: d.text("id").primaryKey(),
     name: d.text("name").notNull(),
     email: d.text("email").notNull().unique(),
     emailVerified: d.boolean("email_verified")
       .$defaultFn(() => false)
       .notNull(),
     image: d.text("image"),
     createdAt: d.timestamp("created_at")
       .$defaultFn(() => new Date())
       .notNull(),
     updatedAt: d.timestamp("updated_at")
       .$defaultFn(() => new Date())
       .notNull(),
    role: d.text("role"),
    banned: d.boolean("banned"),
    banReason: d.text("ban_reason"),
    banExpires: d.timestamp("ban_expires"),
  }),
  (t) => [index("email_idx").on(t.email)],
) 

export const session = createTable("session", (d)=>({
  id: d.text("id").primaryKey(),
  expiresAt: d.timestamp("expires_at").notNull(),
  token: d.text("token").notNull().unique(),
  createdAt: d.timestamp("created_at").notNull(),
  updatedAt: d.timestamp("updated_at").notNull(),
  ipAddress: d.text("ip_address"),
  userAgent: d.text("user_agent"),
  userId: d.text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: d.text("impersonated_by"),
}));

export const account = createTable("account", (d)=>({
  id: d.text("id").primaryKey(),
  accountId: d.text("account_id").notNull(),
  providerId: d.text("provider_id").notNull(),
  userId: d.text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: d.text("access_token"),
  refreshToken: d.text("refresh_token"),
  idToken: d.text("id_token"),
  accessTokenExpiresAt: d.timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: d.timestamp("refresh_token_expires_at"),
  scope: d.text("scope"),
  password: d.text("password"),
  createdAt: d.timestamp("created_at").notNull(), 
  updatedAt: d.timestamp("updated_at").notNull(),
}));

export const verification = createTable("verification", (d)=>({
  id: d.text("id").primaryKey(),
  identifier: d.text("identifier").notNull(),
  value: d.text("value").notNull(),
  expiresAt: d.timestamp("expires_at").notNull(),
  createdAt: d.timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: d.timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
}));

export const subscription = createTable("subscription",(d) =>({
  id: d.text("id").primaryKey(),
  createdAt: d.timestamp("createdAt").notNull(),
  modifiedAt: d.timestamp("modifiedAt"),
  amount: d.integer("amount").notNull(),
  currency: d.text("currency").notNull(),
  recurringInterval: d.text("recurringInterval").notNull(),
  status: d.text("status").notNull(),
  currentPeriodStart: d.timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: d.timestamp("currentPeriodEnd").notNull(),
  cancelAtPeriodEnd: d.boolean("cancelAtPeriodEnd").notNull().default(false),
  canceledAt: d.timestamp("canceledAt"),
  startedAt: d.timestamp("startedAt").notNull(),
  endsAt: d.timestamp("endsAt"),
  endedAt: d.timestamp("endedAt"),
  customerId: d.text("customerId").notNull(),
  productId: d.text("productId").notNull(),
  discountId: d.text("discountId"),
  checkoutId: d.text("checkoutId").notNull(),
  customerCancellationReason: d.text("customerCancellationReason"),
  customerCancellationComment: d.text("customerCancellationComment"),
  metadata: d.text("metadata"), // JSON string
  customFieldData: d.text("customFieldData"), // JSON string
  userId: d.text("userId").references(() => user.id),
}));