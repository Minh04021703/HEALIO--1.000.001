import { IStorage } from "./storage";
import { User, InsertUser, HealthRecord, InsertHealthRecord, Appointment, InsertAppointment } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private healthRecords: Map<number, HealthRecord[]>;
  private appointments: Map<number, Appointment[]>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.healthRecords = new Map();
    this.appointments = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getHealthRecords(userId: number): Promise<HealthRecord[]> {
    return this.healthRecords.get(userId) || [];
  }

  async createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord> {
    const id = this.currentId++;
    const healthRecord = { ...record, id };
    const userRecords = this.healthRecords.get(record.userId) || [];
    userRecords.push(healthRecord);
    this.healthRecords.set(record.userId, userRecords);
    return healthRecord;
  }

  async getAppointments(userId: number): Promise<Appointment[]> {
    return this.appointments.get(userId) || [];
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentId++;
    const newAppointment = { ...appointment, id };
    const userAppointments = this.appointments.get(appointment.userId) || [];
    userAppointments.push(newAppointment);
    this.appointments.set(appointment.userId, userAppointments);
    return newAppointment;
  }
}

export const storage = new MemStorage();