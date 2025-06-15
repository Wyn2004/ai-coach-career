import {
  integer,
  pgTable,
  timestamp,
  varchar,
  json,
} from "drizzle-orm/pg-core";

export enum AiAgentType {
  AI_RESUME_ANALYSIS_ROLE = "AI_RESUME_ANALYSIS_ROLE",
  AI_RESUME_ANALYSIS_JD = "AI_RESUME_ANALYSIS_JD",
  AI_COACH_CHAT = "AI_COACH_CHAT",
}

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const historyTable = pgTable("historyTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  recordId: varchar().notNull(),
  content: json(),
  aiAgentType: varchar(),
  userEmail: varchar("userEmail").references(() => usersTable.email),
  cvFileUrl: varchar(),
  jdFileUrl: varchar(),
  roleDecriptions: varchar(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const interviewTable = pgTable("interviewTable", {
  id: varchar().primaryKey(),
  questionList: json(),
  job_description: varchar(),
  question_count: integer(),
  role: varchar(),
  total_estimated_duration: integer(),
  interview_type: varchar(),
  userEmail: varchar("userEmail").references(() => usersTable.email),
  createdAt: timestamp().notNull().defaultNow(),
});
