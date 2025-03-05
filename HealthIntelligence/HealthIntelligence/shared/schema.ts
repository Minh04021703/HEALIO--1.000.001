import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  gender: text("gender").notNull(),
});

export const healthRecords = pgTable("health_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  recordType: text("record_type").notNull(),
  diagnosis: text("diagnosis").notNull(),
  doctor: text("doctor").notNull(),
  date: text("date").notNull(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  doctor: text("doctor").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  clinic: text("clinic").notNull(),
  status: text("status").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  dateOfBirth: true,
  gender: true,
});

export const insertHealthRecordSchema = createInsertSchema(healthRecords).pick({
  userId: true,
  recordType: true,
  diagnosis: true,
  doctor: true,
  date: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).pick({
  userId: true,
  doctor: true,
  date: true,
  time: true,
  clinic: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertHealthRecord = z.infer<typeof insertHealthRecordSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type User = typeof users.$inferSelect;
export type HealthRecord = typeof healthRecords.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;