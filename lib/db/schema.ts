import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  ...timestamps,
});

export const units = pgTable(
  "units",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id),
    name: varchar("name", { length: 160 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    timezone: varchar("timezone", { length: 80 }).notNull().default("America/Sao_Paulo"),
    active: boolean("active").notNull().default(true),
    ...timestamps,
  },
  (table) => [index("units_organization_idx").on(table.organizationId)],
);

export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 40 }).notNull().unique(),
  name: varchar("name", { length: 80 }).notNull(),
  description: text("description").notNull(),
  system: boolean("system").notNull().default(true),
  ...timestamps,
});

export const permissions = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description").notNull(),
  ...timestamps,
});

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.roleId, table.permissionId] })],
);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    unitId: uuid("unit_id").notNull().references(() => units.id),
    roleId: uuid("role_id").notNull().references(() => roles.id),
    username: varchar("username", { length: 80 }).notNull(),
    usernameNormalized: varchar("username_normalized", { length: 80 }).notNull(),
    displayName: varchar("display_name", { length: 140 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    mustChangePassword: boolean("must_change_password").notNull().default(true),
    active: boolean("active").notNull().default(true),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    passwordChangedAt: timestamp("password_changed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("users_username_normalized_unique").on(table.usernameNormalized),
    index("users_unit_idx").on(table.unitId),
    index("users_role_idx").on(table.roleId),
  ],
);

export const userPermissionOverrides = pgTable(
  "user_permission_overrides",
  {
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" }),
    allowed: boolean("allowed").notNull(),
    createdByUserId: uuid("created_by_user_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.permissionId] })],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    absoluteExpiresAt: timestamp("absolute_expires_at", { withTimezone: true }).notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow().notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    ipAddress: varchar("ip_address", { length: 64 }),
    userAgent: varchar("user_agent", { length: 512 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("sessions_token_hash_unique").on(table.tokenHash),
    index("sessions_user_idx").on(table.userId),
    index("sessions_expiry_idx").on(table.expiresAt),
  ],
);

export const loginRateLimits = pgTable("login_rate_limits", {
  keyHash: varchar("key_hash", { length: 64 }).primaryKey(),
  failures: integer("failures").notNull().default(0),
  blockedUntil: timestamp("blocked_until", { withTimezone: true }),
  lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    unitId: uuid("unit_id").references(() => units.id),
    actorUserId: uuid("actor_user_id").references(() => users.id),
    action: varchar("action", { length: 100 }).notNull(),
    outcome: varchar("outcome", { length: 30 }).notNull(),
    targetType: varchar("target_type", { length: 80 }),
    targetId: varchar("target_id", { length: 120 }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    ipAddress: varchar("ip_address", { length: 64 }),
    userAgent: varchar("user_agent", { length: 512 }),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("audit_events_occurred_at_idx").on(table.occurredAt),
    index("audit_events_actor_idx").on(table.actorUserId),
    index("audit_events_action_idx").on(table.action),
  ],
);

export type UserRecord = typeof users.$inferSelect;
export type AuditEventRecord = typeof auditEvents.$inferSelect;
