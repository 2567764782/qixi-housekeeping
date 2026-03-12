import { pgTable, serial, timestamp, varchar, text, integer, boolean, decimal } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod"

// 系统表
export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 用户表
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  nickname: varchar("nickname", { length: 64 }), // 昵称
  avatar: varchar("avatar", { length: 500 }), // 头像URL
  gender: varchar("gender", { length: 10 }), // 性别: male, female
  city: varchar("city", { length: 50 }), // 城市
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
})

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

// 服务人员表
export const staff = pgTable("staff", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 64 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  category: varchar("category", { length: 50 }).notNull(), // cleaning 或 renovation
  status: varchar("status", { length: 20 }).notNull().default('offline'), // online, offline, busy
  location: varchar("location", { length: 200 }), // 位置信息
  rating: decimal("rating", { precision: 3, scale: 2 }).default('0.00'), // 评分 0.00-5.00
  totalOrders: integer("total_orders").default(0).notNull(), // 总订单数
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

  // 自动接单/派单相关字段
  staffId: varchar("staff_id", { length: 36 }), // 分配的服务人员 ID
  assignedAt: timestamp("assigned_at", { withTimezone: true, mode: 'string' }), // 派单时间
  autoConfirmed: boolean("auto_confirmed").default(false), // 是否自动接单
  autoAssigned: boolean("auto_assigned").default(false), // 是否自动派单

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

export const insertUserSchema = createCoercedInsertSchema(users).pick({
  phone: true,
  nickname: true,
  avatar: true,
  gender: true,
  city: true,
})

export const updateUserSchema = createCoercedInsertSchema(users).pick({
  nickname: true,
  avatar: true,
  gender: true,
  city: true,
}).partial()

export const insertStaffSchema = createCoercedInsertSchema(staff).pick({
  name: true,
  phone: true,
  category: true,
  status: true,
  location: true,
})

export const updateStaffSchema = createCoercedInsertSchema(staff).pick({
  name: true,
  phone: true,
  category: true,
  status: true,
  location: true,
  rating: true,
  totalOrders: true,
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
  staffId: true,
  assignedAt: true,
  autoConfirmed: true,
  autoAssigned: true,
}).partial()

// TypeScript types
export type User = typeof users.$inferSelect
export type InsertUser = z.infer<typeof insertUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>

export type Service = typeof services.$inferSelect
export type InsertService = z.infer<typeof insertServiceSchema>
export type UpdateService = z.infer<typeof updateOrderSchema>

export type Staff = typeof staff.$inferSelect
export type InsertStaff = z.infer<typeof insertStaffSchema>
export type UpdateStaff = z.infer<typeof updateStaffSchema>

export type Order = typeof orders.$inferSelect
export type InsertOrder = z.infer<typeof insertOrderSchema>
export type UpdateOrder = z.infer<typeof updateOrderSchema>
