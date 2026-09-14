import { z } from "zod";

// ─── Auth ───────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().min(1, "E-posta veya kullanıcı adı gerekli"),
  password: z.string().min(1, "Şifre gerekli"),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Kullanıcı adı en az 3 karakter olmalı")
      .max(16, "Kullanıcı adı en fazla 16 karakter olabilir")
      .regex(/^[a-zA-Z0-9_]+$/, "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir"),
    email: z.string().email("Geçerli bir e-posta adresi girin"),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalı")
      .regex(/[A-Z]/, "Şifre en az bir büyük harf içermeli")
      .regex(/[0-9]/, "Şifre en az bir rakam içermeli"),
    confirmPassword: z.string(),
    mcUsername: z
      .string()
      .min(3, "Minecraft kullanıcı adı en az 3 karakter olmalı")
      .max(16, "Minecraft kullanıcı adı en fazla 16 karakter olabilir")
      .regex(/^[a-zA-Z0-9_]+$/, "Geçersiz Minecraft kullanıcı adı"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifre gerekli"),
    newPassword: z
      .string()
      .min(8, "Yeni şifre en az 8 karakter olmalı")
      .regex(/[A-Z]/, "Yeni şifre en az bir büyük harf içermeli")
      .regex(/[0-9]/, "Yeni şifre en az bir rakam içermeli"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmNewPassword"],
  });

// ─── Tickets ────────────────────────────────────────────────

export const createTicketSchema = z.object({
  subject: z.string().min(5, "Konu en az 5 karakter olmalı").max(100, "Konu en fazla 100 karakter olabilir"),
  category: z.enum(["TECHNICAL", "PURCHASE", "PLAYER_REPORT", "BAN_APPEAL", "BUG_REPORT", "OTHER"], {
    message: "Geçerli bir kategori seçin",
  }),
  description: z.string().min(20, "Açıklama en az 20 karakter olmalı").max(2000, "Açıklama en fazla 2000 karakter olabilir"),
  mcUsername: z.string().optional(),
});

export const ticketReplySchema = z.object({
  content: z.string().min(1, "Mesaj boş olamaz").max(2000, "Mesaj en fazla 2000 karakter olabilir"),
});

// ─── News ───────────────────────────────────────────────────

export const createNewsSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı").max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  summary: z.string().min(10, "Özet en az 10 karakter olmalı").max(500),
  content: z.string().min(20, "İçerik en az 20 karakter olmalı"),
  coverImage: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().min(1, "Kategori seçin"),
  authorName: z.string().min(1, "Yazar adı gerekli"),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  scheduledAt: z.string().optional(),
});

// ─── Wiki ───────────────────────────────────────────────────

export const createWikiArticleSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı").max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  content: z.string().min(10, "İçerik en az 10 karakter olmalı"),
  categoryId: z.string().min(1, "Kategori seçin"),
  isPublished: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

// ─── Rules ──────────────────────────────────────────────────

export const createRuleSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı").max(200),
  content: z.string().min(5, "İçerik en az 5 karakter olmalı").max(1000),
  categoryId: z.string().min(1, "Kategori seçin"),
  ruleNumber: z.number().int().positive(),
});

export const createRuleCategorySchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalı").max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
});

// ─── Products ───────────────────────────────────────────────

export const createProductSchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalı").max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalı"),
  shortDescription: z.string().max(200).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().min(1, "Kategori seçin"),
  price: z.number().positive("Fiyat 0'dan büyük olmalı"),
  discountPrice: z.number().positive().optional().nullable(),
  isVisible: z.boolean(),
  inStock: z.boolean(),
  stockCount: z.number().int().nonnegative().optional().nullable(),
});

// ─── Coupons ────────────────────────────────────────────────

export const createCouponSchema = z.object({
  code: z
    .string()
    .min(3, "Kupon kodu en az 3 karakter olmalı")
    .max(30)
    .regex(/^[A-Z0-9_-]+$/, "Kupon kodu sadece büyük harf, rakam, tire ve alt çizgi içerebilir"),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive("İndirim değeri 0'dan büyük olmalı"),
  minOrderAmount: z.number().nonnegative().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  isActive: z.boolean(),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

// ─── Player Admin ───────────────────────────────────────────

export const editPlayerBalanceSchema = z.object({
  balance: z.number().min(0, "Bakiye 0 veya daha büyük olmalı"),
  reason: z.string().min(3, "Sebep gerekli"),
});

export const punishPlayerSchema = z.object({
  type: z.enum(["BAN", "TEMPBAN", "MUTE", "TEMPMUTE", "KICK", "WARNING"]),
  reason: z.string().min(3, "Sebep gerekli").max(500),
  duration: z.string().optional(),
});

// ─── Settings ───────────────────────────────────────────────

export const serverSettingsSchema = z.object({
  serverIp: z.string().min(1),
  displayAddress: z.string().min(1),
  serverVersion: z.string().min(1),
  maxPlayers: z.number().int().positive(),
  maintenanceMode: z.boolean(),
  motd: z.string().optional(),
  discordUrl: z.string().url().optional().or(z.literal("")),
});

// ─── Search ─────────────────────────────────────────────────

export const searchSchema = z.object({
  query: z.string().min(2, "Arama sorgusu en az 2 karakter olmalı").max(100),
  type: z.enum(["all", "wiki", "news", "players", "clans"]).optional(),
});

// ─── Types ──────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type ServerSettingsInput = z.infer<typeof serverSettingsSchema>;
