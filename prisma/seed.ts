import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminPassword = await bcrypt.hash("Admin@SabiSpice2026", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@sabispice.com" },
    update: {},
    create: {
      name: "Sabi Spice Admin",
      email: "admin@sabispice.com",
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Categories
  const catDefs = [
    { name: "Food Boxes", slug: "food-boxes", description: "Ready-to-enjoy boxes and party trays" },
    { name: "Small Chops", slug: "small-chops", description: "Spring rolls, puff-puff, samosas and more" },
    { name: "Spices & Leaves", slug: "spices-leaves", description: "Dried leaves, peppers and seasonings" },
    { name: "Grains & Seeds", slug: "grains-seeds", description: "Iru, cloves and pantry staples" },
    { name: "Drinks & Teas", slug: "drinks-teas", description: "Zobo and natural tonics" },
  ];
  const cat: Record<string, string> = {};
  for (const c of catDefs) {
    const r = await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
    cat[c.slug] = r.id;
  }
  console.log("✅ Categories created:", catDefs.length);

  // Products (from the Sabi Spice menu)
  const items = [
    { name: "Faaji Box", slug: "faaji-box", price: 50, cat: "food-boxes", featured: true, description: "Our signature party box: spring roll, puff-puff, spicy chicken and mosa." },
    { name: "Organic Cloves", slug: "organic-cloves", price: 4.99, cat: "grains-seeds", description: "Whole organic cloves — aromatic and full of flavour." },
    { name: "Hibiscus (Zobo Leaves)", slug: "hibiscus-zobo-leaves", price: 4.5, cat: "drinks-teas", description: "Hibiscus leaves, often used as a natural, healthy blood tonic. Perfect for zobo." },
    { name: "Dry Efirin Leaf", slug: "dry-efirin-leaf", price: 5.99, cat: "spices-leaves", featured: true, description: "Efirin (scent leaf): fresh, fragrant, and adds a bold aroma to soups and stews." },
    { name: "Dry Bitter Leaf", slug: "dry-bitter-leaf", price: 5.99, cat: "spices-leaves", description: "Dried bitterleaf — clean, fresh and ready to cook." },
    { name: "Spicey Suya Pepper", slug: "spicey-suya-pepper", price: 5.99, cat: "spices-leaves", featured: true, description: "Original Northern suya pepper (yaji). Bold, smoky and full of heat." },
    { name: "Organic Locust Beans (Iru) Ekiti", slug: "organic-locust-beans-iru-ekiti", price: 6.99, cat: "grains-seeds", description: "Fresh iru (locust beans) — clean, aromatic and flavour-packed." },
  ];
  for (const i of items) {
    await prisma.product.upsert({
      where: { slug: i.slug }, update: {},
      create: { name: i.name, slug: i.slug, description: i.description, price: i.price, images: [], stock: 50, featured: !!i.featured, categoryId: cat[i.cat] },
    });
  }
  console.log("✅ Products created:", items.length);

  // Sample testimonials
  await prisma.testimonial.createMany({
    skipDuplicates: true,
    data: [
      { authorName: "Adaeze N.", content: "The Faaji box was the star of my birthday! Everyone kept asking where the puff-puff came from.", rating: 5, source: "CUSTOMER", approved: true },
      { authorName: "Tunde A.", content: "Finally, efirin and iru that actually smell fresh. My egusi has never tasted better.", rating: 5, source: "CUSTOMER", approved: true },
      { authorName: "Grace M.", content: "Sabi Spice catered our office party and the small chops disappeared in minutes.", rating: 5, source: "CUSTOMER", approved: true },
    ],
  });
  console.log("✅ Testimonials created");

  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Admin credentials:");
  console.log("   Email:    admin@sabispice.com");
  console.log("   Password: Admin@SabiSpice2026");
}

main().catch(console.error).finally(() => prisma.$disconnect());
