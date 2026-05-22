import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  model: text("model").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull().references(() => categories.slug),
  subType: text("sub_type"),
  series: text("series"),
  variant: text("variant"),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  features: text("features").notNull().default("[]"),
  image: text("image").notNull(),
  images: text("images").notNull().default("[]"),
  techParams: text("tech_params"),
  specifications: text("specifications").notNull().default("{}"),
  torque: text("torque"),
  forceRange: text("force_range"),
  hardTorque: text("hard_torque"),
  hardForce: text("hard_force"),
  soundType: text("sound_type"),
  durability: text("durability"),
  materials: text("materials").default("[]"),
  characteristics: text("characteristics").default("[]"),
  dimensionDrawing: text("dimension_drawing"),
  performanceCharts: text("performance_charts"),
  bufferDirection: text("buffer_direction"),
  assemblyMethod: text("assembly_method"),
  applications: text("applications").notNull().default("[]"),
  applicationScenarios: text("application_scenarios").default("[]"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  tags: text("tags").default("[]"),
  status: text("status").default("active"),
  isActive: integer("is_active").notNull().default(1),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const news = sqliteTable("news", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  isPublished: integer("is_published").notNull().default(0),
  publishedAt: text("published_at").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const analyticsEvents = sqliteTable("analytics_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  event: text("event").notNull(),
  page: text("page").notNull(),
  targetType: text("target_type"),
  targetId: text("target_id"),
  source: text("source"),
  metadata: text("metadata"),
  sessionId: text("session_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const contactInquiries = sqliteTable("contact_inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email").notNull(),
  phone: text("phone"),
  country: text("country"),
  productInterest: text("product_interest"),
  annualVolume: text("annual_volume"),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
