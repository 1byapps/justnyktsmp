import { prisma } from "./prisma";

// ─── Permission Constants ───────────────────────────────────

export const PERMISSIONS = {
  // Players
  PLAYERS_VIEW: "players.view",
  PLAYERS_EDIT: "players.edit",
  PLAYERS_BAN: "players.ban",

  // Shop
  SHOP_MANAGE: "shop.manage",

  // Orders
  ORDERS_VIEW: "orders.view",
  ORDERS_MANAGE: "orders.manage",

  // News
  NEWS_MANAGE: "news.manage",

  // Wiki
  WIKI_MANAGE: "wiki.manage",

  // Rules
  RULES_MANAGE: "rules.manage",

  // Tickets
  TICKETS_VIEW: "tickets.view",
  TICKETS_REPLY: "tickets.reply",
  TICKETS_CLOSE: "tickets.close",

  // Bans
  BANS_VIEW: "bans.view",
  BANS_MANAGE: "bans.manage",

  // Clans
  CLANS_MANAGE: "clans.manage",

  // Coupons
  COUPONS_MANAGE: "coupons.manage",

  // Settings
  SETTINGS_MANAGE: "settings.manage",

  // Users
  USERS_VIEW: "users.view",
  USERS_MANAGE: "users.manage",

  // Roles
  ROLES_MANAGE: "roles.manage",

  // Logs
  LOGS_VIEW: "logs.view",

  // Server
  SERVER_MANAGE: "server.manage",

  // Admin Dashboard
  ADMIN_DASHBOARD: "admin.dashboard",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ─── Permission Checking ────────────────────────────────────

export async function getUserPermissions(userId: string): Promise<string[]> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  const permissions = new Set<string>();
  for (const userRole of userRoles) {
    for (const rolePermission of userRole.role.rolePermissions) {
      permissions.add(rolePermission.permission.key);
    }
  }

  return Array.from(permissions);
}

export async function hasPermission(userId: string, permission: string): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissions.includes(permission);
}

export async function hasAnyPermission(userId: string, requiredPermissions: string[]): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return requiredPermissions.some((p) => permissions.includes(p));
}

export async function hasAllPermissions(userId: string, requiredPermissions: string[]): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return requiredPermissions.every((p) => permissions.includes(p));
}

export async function getUserRoles(userId: string): Promise<string[]> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true },
  });
  return userRoles.map((ur: { role: { name: string } }) => ur.role.name);
}

export async function isAdmin(userId: string): Promise<boolean> {
  const roles = await getUserRoles(userId);
  return roles.includes("owner") || roles.includes("admin");
}

export async function isStaff(userId: string): Promise<boolean> {
  const roles = await getUserRoles(userId);
  const staffRoles = ["owner", "admin", "moderator", "support", "content_manager", "developer"];
  return roles.some((r) => staffRoles.includes(r));
}

// ─── Client-side permission check (from session) ────────────

export function checkPermission(userPermissions: string[], required: string): boolean {
  return userPermissions.includes(required);
}

export function checkAnyPermission(userPermissions: string[], required: string[]): boolean {
  return required.some((p) => userPermissions.includes(p));
}
