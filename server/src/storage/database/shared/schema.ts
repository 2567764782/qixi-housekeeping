import { pgTable, serial, timestamp, varchar, text, integer, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod"

// 系统表
export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 服务表
export const services = pgTable("services", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // cleaning 或 renovation
  price: varchar("price", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull(), // 图标名称
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
})

// 订单表
export const orders = pgTable("orders", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull(), // 用户 ID（暂时用模拟 ID）
  serviceId: varchar("service_id", { length: 36 }).notNull(), // 服务 ID
  serviceName: varchar("service_name", { length: 128 }).notNull(), // 服务名称（冗余存储）
  address: text("address").notNull(), // 服务地址
  phone: varchar("phone", { length: 20 }).notNull(), // 联系电话
  appointmentDate: varchar("appointment_date", { length: 50 }).notNull(), // 预约日期
  appointmentTime: varchar("appointment_time", { length: 50 }).notNull(), // 预约时间
  status: varchar("status", { length: 50 }).notNull().default('pending'), // 订单状态：pending, confirmed, completed, cancelled
  remark: text("remark"), // 备注
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
})

// Zod schemas
const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({
  coerce: { date: true },
})

export const insertServiceSchema = createCoercedInsertSchema(services).pick({
  name: true,
  description: true,
  category: true,
  price: true,
  icon: true,
})

export const updateServiceSchema = createCoercedInsertSchema(services).pick({
  name: true,
  description: true,
  category: true,
  price: true,
  icon: true,
}).partial()

export const insertOrderSchema = createCoercedInsertSchema(orders).pick({
  userId: true,
  serviceId: true,
  serviceName: true,
  address: true,
  phone: true,
  appointmentDate: true,
  appointmentTime: true,
  remark: true,
})

export const updateOrderSchema = createCoercedInsertSchema(orders).pick({
  status: true,
}).partial()

// TypeScript types
export type Service = typeof services.$inferSelect
export type InsertService = z.infer<typeof insertServiceSchema>
export type UpdateService = z.infer<typeof updateOrderSchema>
export type Order = typeof orders.$inferSelect
export type InsertOrder = z.infer<typeof insertOrderSchema>
export type UpdateOrder = z.infer<typeof updateOrderSchema>
