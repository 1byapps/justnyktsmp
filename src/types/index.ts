// ─── API Response Types ─────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Server Status ──────────────────────────────────────────

export interface ServerStatus {
  online: boolean;
  players: {
    online: number;
    max: number;
  };
  version: string;
  motd?: string;
}

// ─── Navigation ─────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}

// ─── Player ─────────────────────────────────────────────────

export interface PlayerProfile {
  id: string;
  uuid: string;
  username: string;
  rankName: string | null;
  balance: number;
  playtimeMinutes: number;
  kills: number;
  deaths: number;
  level: number;
  experience: number;
  questsCompleted: number;
  blocksBroken: number;
  fishCaught: number;
  firstJoinAt: string;
  lastSeenAt: string;
  isOnline: boolean;
  clan?: {
    id: string;
    name: string;
    tag: string;
    slug: string;
    role: string;
  } | null;
}

// ─── Leaderboard ────────────────────────────────────────────

export type LeaderboardCategory =
  | "balance"
  | "playtime"
  | "kills"
  | "deaths"
  | "kd"
  | "quests"
  | "level"
  | "clan"
  | "blocks"
  | "fish";

export interface LeaderboardEntry {
  rank: number;
  username: string;
  uuid: string;
  value: number | string;
  clan?: string | null;
}

// ─── News ───────────────────────────────────────────────────

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string | null;
  category: {
    name: string;
    slug: string;
    color: string;
  };
  authorName: string;
  authorAvatar: string | null;
  tags: string[];
  publishedAt: string;
  createdAt: string;
}

// ─── Wiki ───────────────────────────────────────────────────

export interface WikiArticleType {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  };
  updatedAt: string;
}

// ─── Cart ───────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: number;
  discountPrice: number | null;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discount: number;
}

// ─── Ticket ─────────────────────────────────────────────────

export interface TicketDetail {
  id: string;
  subject: string;
  category: string;
  status: string;
  mcUsername: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  messages: TicketMessageType[];
}

export interface TicketMessageType {
  id: string;
  content: string;
  isStaffReply: boolean;
  attachmentUrl: string | null;
  createdAt: string;
  user: {
    username: string;
    image: string | null;
  };
}

// ─── Clan ───────────────────────────────────────────────────

export interface ClanDetail {
  id: string;
  name: string;
  tag: string;
  slug: string;
  description: string | null;
  avatarUrl: string | null;
  level: number;
  balance: number;
  score: number;
  maxMembers: number;
  createdAt: string;
  members: ClanMemberType[];
}

export interface ClanMemberType {
  id: string;
  role: string;
  joinedAt: string;
  player: {
    uuid: string;
    username: string;
    level: number;
    isOnline: boolean;
  };
}

// ─── Notification ───────────────────────────────────────────

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

// ─── Admin Dashboard ────────────────────────────────────────

export interface DashboardStats {
  onlinePlayers: number;
  registeredUsers: number;
  newUsersToday: number;
  newTickets: number;
  pendingTickets: number;
  todayOrders: number;
  revenue: number;
  serverOnline: boolean;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

// ─── Session ────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  email: string;
  username: string;
  image?: string | null;
  roles: string[];
  permissions: string[];
}
