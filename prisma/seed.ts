import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Permissions ────────────────────────────────────────────
  const permissionData = [
    { key: "admin.dashboard", displayName: "Admin Panel Erişimi", category: "Genel", description: "Admin paneline erişim" },
    { key: "players.view", displayName: "Oyuncuları Görüntüle", category: "Oyuncular", description: "Oyuncu listesini görüntüleme" },
    { key: "players.edit", displayName: "Oyuncuları Düzenle", category: "Oyuncular", description: "Oyuncu verilerini düzenleme" },
    { key: "players.ban", displayName: "Oyuncu Cezalandır", category: "Oyuncular", description: "Ban, mute ve diğer cezalar" },
    { key: "shop.manage", displayName: "Mağaza Yönetimi", category: "Mağaza", description: "Ürün ekleme, düzenleme, silme" },
    { key: "orders.view", displayName: "Siparişleri Görüntüle", category: "Mağaza", description: "Sipariş listesini görüntüleme" },
    { key: "orders.manage", displayName: "Siparişleri Yönet", category: "Mağaza", description: "Sipariş durumunu değiştirme" },
    { key: "news.manage", displayName: "Haber Yönetimi", category: "İçerik", description: "Haber oluşturma, düzenleme, silme" },
    { key: "wiki.manage", displayName: "Wiki Yönetimi", category: "İçerik", description: "Wiki makaleleri yönetimi" },
    { key: "rules.manage", displayName: "Kural Yönetimi", category: "İçerik", description: "Kural oluşturma, düzenleme, silme" },
    { key: "tickets.view", displayName: "Ticketları Görüntüle", category: "Destek", description: "Destek taleplerini görüntüleme" },
    { key: "tickets.reply", displayName: "Ticketlara Yanıt Ver", category: "Destek", description: "Destek taleplerine yanıt verme" },
    { key: "tickets.close", displayName: "Ticketları Kapat", category: "Destek", description: "Destek taleplerini kapatma" },
    { key: "bans.view", displayName: "Cezaları Görüntüle", category: "Moderasyon", description: "Ceza listesini görüntüleme" },
    { key: "bans.manage", displayName: "Cezaları Yönet", category: "Moderasyon", description: "Ceza verme ve kaldırma" },
    { key: "clans.manage", displayName: "Klan Yönetimi", category: "Klanlar", description: "Klan düzenleme ve silme" },
    { key: "coupons.manage", displayName: "Kupon Yönetimi", category: "Mağaza", description: "Kupon oluşturma ve düzenleme" },
    { key: "settings.manage", displayName: "Ayarlar Yönetimi", category: "Sistem", description: "Site ve sunucu ayarları" },
    { key: "users.view", displayName: "Kullanıcıları Görüntüle", category: "Kullanıcılar", description: "Kullanıcı listesini görüntüleme" },
    { key: "users.manage", displayName: "Kullanıcıları Yönet", category: "Kullanıcılar", description: "Kullanıcı düzenleme ve silme" },
    { key: "roles.manage", displayName: "Rol Yönetimi", category: "Sistem", description: "Rol ve yetki yönetimi" },
    { key: "logs.view", displayName: "Logları Görüntüle", category: "Sistem", description: "Denetim loglarını görüntüleme" },
    { key: "server.manage", displayName: "Sunucu Yönetimi", category: "Sistem", description: "Sunucu ayarları ve bakım modu" },
  ];

  const permissions = [];
  for (const p of permissionData) {
    const perm = await prisma.permission.upsert({
      where: { key: p.key },
      update: { displayName: p.displayName, category: p.category, description: p.description },
      create: p,
    });
    permissions.push(perm);
  }
  console.log(`  ✅ ${permissions.length} permissions created`);

  // ─── Roles ──────────────────────────────────────────────────
  const allPermKeys = permissions.map((p) => p.key);

  const rolesConfig = [
    {
      name: "owner",
      displayName: "Sahip",
      description: "Sunucu sahibi — tüm yetkiler",
      color: "#ef4444",
      priority: 100,
      permissions: allPermKeys,
    },
    {
      name: "admin",
      displayName: "Admin",
      description: "Yönetici — tüm yetkiler",
      color: "#f59e0b",
      priority: 90,
      permissions: allPermKeys,
    },
    {
      name: "moderator",
      displayName: "Moderatör",
      description: "Moderatör — oyuncu ve içerik yönetimi",
      color: "#3b82f6",
      priority: 70,
      permissions: [
        "admin.dashboard", "players.view", "players.edit", "players.ban",
        "tickets.view", "tickets.reply", "tickets.close",
        "bans.view", "bans.manage", "clans.manage", "logs.view",
      ],
    },
    {
      name: "support",
      displayName: "Destek",
      description: "Destek ekibi — ticket yönetimi",
      color: "#10b981",
      priority: 50,
      permissions: [
        "admin.dashboard", "players.view",
        "tickets.view", "tickets.reply", "tickets.close",
        "bans.view",
      ],
    },
    {
      name: "content_manager",
      displayName: "İçerik Yöneticisi",
      description: "İçerik yönetimi — haberler, wiki, kurallar",
      color: "#8b5cf6",
      priority: 40,
      permissions: [
        "admin.dashboard",
        "news.manage", "wiki.manage", "rules.manage",
      ],
    },
    {
      name: "developer",
      displayName: "Geliştirici",
      description: "Geliştirici — teknik erişim",
      color: "#06b6d4",
      priority: 60,
      permissions: [
        "admin.dashboard", "players.view", "players.edit",
        "settings.manage", "server.manage", "logs.view",
      ],
    },
    {
      name: "user",
      displayName: "Oyuncu",
      description: "Normal kullanıcı",
      color: "#71717a",
      priority: 0,
      isDefault: true,
      permissions: [],
    },
  ];

  for (const roleConfig of rolesConfig) {
    const { permissions: permKeys, ...roleData } = roleConfig;

    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: { displayName: roleData.displayName, description: roleData.description, color: roleData.color, priority: roleData.priority },
      create: {
        name: roleData.name,
        displayName: roleData.displayName,
        description: roleData.description,
        color: roleData.color,
        priority: roleData.priority,
        isDefault: roleData.isDefault ?? false,
      },
    });

    // Clear existing permissions and re-assign
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });

    for (const key of permKeys) {
      const perm = permissions.find((p) => p.key === key);
      if (perm) {
        await prisma.rolePermission.create({
          data: { roleId: role.id, permissionId: perm.id },
        });
      }
    }
  }
  console.log(`  ✅ ${rolesConfig.length} roles created`);

  // ─── Default Admin User ─────────────────────────────────────
  const adminPassword = await hash("Admin123!", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@justnyktsmp.net" },
    update: {},
    create: {
      email: "admin@justnyktsmp.net",
      username: "admin",
      hashedPassword: adminPassword,
      emailVerified: new Date(),
      profile: {
        create: {
          displayName: "Admin",
        },
      },
    },
  });

  const ownerRole = await prisma.role.findUnique({ where: { name: "owner" } });
  if (ownerRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: ownerRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: ownerRole.id },
    });
  }
  console.log("  ✅ Admin user created (admin@justnyktsmp.net / Admin123!)");

  // ─── News Categories ───────────────────────────────────────
  const newsCategories = [
    { name: "Güncelleme", slug: "guncelleme", color: "#10b981", sortOrder: 0 },
    { name: "Etkinlik", slug: "etkinlik", color: "#8b5cf6", sortOrder: 1 },
    { name: "Duyuru", slug: "duyuru", color: "#3b82f6", sortOrder: 2 },
    { name: "Bakım", slug: "bakim", color: "#f59e0b", sortOrder: 3 },
    { name: "Sezon", slug: "sezon", color: "#84cc16", sortOrder: 4 },
  ];

  for (const cat of newsCategories) {
    await prisma.newsCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log("  ✅ News categories created");

  // ─── Wiki Categories ───────────────────────────────────────
  const wikiCategories = [
    { name: "Başlangıç", slug: "baslangic", icon: "BookOpen", sortOrder: 0 },
    { name: "Ekonomi", slug: "ekonomi", icon: "Coins", sortOrder: 1 },
    { name: "Market", slug: "market", icon: "Store", sortOrder: 2 },
    { name: "Klanlar", slug: "klanlar", icon: "Shield", sortOrder: 3 },
    { name: "Görevler", slug: "gorevler", icon: "Scroll", sortOrder: 4 },
    { name: "Rütbeler", slug: "rutbeler", icon: "Crown", sortOrder: 5 },
    { name: "Komutlar", slug: "komutlar", icon: "Terminal", sortOrder: 6 },
    { name: "Etkinlikler", slug: "etkinlikler", icon: "Trophy", sortOrder: 7 },
    { name: "SSS", slug: "sss", icon: "HelpCircle", sortOrder: 8 },
  ];

  for (const cat of wikiCategories) {
    await prisma.wikiCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log("  ✅ Wiki categories created");

  // ─── Rule Categories ───────────────────────────────────────
  const ruleCategories = [
    { name: "Genel Kurallar", slug: "genel-kurallar", sortOrder: 0 },
    { name: "Sohbet Kuralları", slug: "sohbet-kurallari", sortOrder: 1 },
    { name: "Oyun İçi Davranış", slug: "oyun-ici-davranis", sortOrder: 2 },
    { name: "Hile ve Exploit", slug: "hile-ve-exploit", sortOrder: 3 },
    { name: "Ticaret Kuralları", slug: "ticaret-kurallari", sortOrder: 4 },
    { name: "PvP Kuralları", slug: "pvp-kurallari", sortOrder: 5 },
    { name: "Klan Kuralları", slug: "klan-kurallari", sortOrder: 6 },
    { name: "Discord Kuralları", slug: "discord-kurallari", sortOrder: 7 },
  ];

  for (const cat of ruleCategories) {
    await prisma.ruleCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log("  ✅ Rule categories created");

  // ─── Product Categories ────────────────────────────────────
  const productCategories = [
    { name: "Rütbeler", slug: "rutbeler", icon: "Crown", sortOrder: 0 },
    { name: "Anahtarlar", slug: "anahtarlar", icon: "Key", sortOrder: 1 },
    { name: "Kozmetik", slug: "kozmetik", icon: "Sparkles", sortOrder: 2 },
    { name: "Paketler", slug: "paketler", icon: "Package", sortOrder: 3 },
    { name: "Destek Paketleri", slug: "destek-paketleri", icon: "Heart", sortOrder: 4 },
  ];

  for (const cat of productCategories) {
    await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log("  ✅ Product categories created");

  // ─── Default Settings ──────────────────────────────────────
  const defaultSettings = [
    { key: "server_ip", value: "play.justnyktsmp.net", type: "string" },
    { key: "display_address", value: "play.justnyktsmp.net", type: "string" },
    { key: "server_version", value: "1.21.x", type: "string" },
    { key: "max_players", value: "500", type: "number" },
    { key: "maintenance_mode", value: "false", type: "boolean" },
    { key: "motd", value: "JustNyktSMP - Modern SMP Deneyimi", type: "string" },
    { key: "discord_url", value: "https://discord.gg/justnyktsmp", type: "string" },
    { key: "store_enabled", value: "true", type: "boolean" },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, type: setting.type },
      create: setting,
    });
  }
  console.log("  ✅ Default settings created");

  // ─── Vote Sites ────────────────────────────────────────────
  const voteSites = [
    { name: "MinecraftServerList", url: "https://minecraft-server-list.com/server/justnyktsmp/vote", reward: "500 Coin + 1 Oy Puanı", cooldownHours: 24, sortOrder: 0 },
    { name: "TopG", url: "https://topg.org/minecraft-servers/server-justnyktsmp", reward: "500 Coin + 1 Oy Puanı", cooldownHours: 24, sortOrder: 1 },
    { name: "MinecraftMP", url: "https://minecraft-mp.com/server-justnyktsmp/vote", reward: "500 Coin + 1 Oy Puanı", cooldownHours: 24, sortOrder: 2 },
    { name: "PlanetMinecraft", url: "https://planetminecraft.com/server/justnyktsmp/vote", reward: "750 Coin + 1 Oy Puanı", cooldownHours: 24, sortOrder: 3 },
    { name: "MCServerList", url: "https://mcserverlist.net/server/justnyktsmp/vote", reward: "500 Coin + 1 Oy Puanı", cooldownHours: 24, sortOrder: 4 },
  ];

  for (const site of voteSites) {
    const existing = await prisma.voteSite.findFirst({ where: { name: site.name } });
    if (!existing) {
      await prisma.voteSite.create({ data: site });
    }
  }
  console.log("  ✅ Vote sites created");

  console.log("\n✨ Seed completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
