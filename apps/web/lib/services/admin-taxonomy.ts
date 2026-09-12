import { prisma } from "@/lib/db/prisma";

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

export async function getAllTopicsAdmin() {
  return prisma.topic.findMany({
    select: { id: true, name: true, slug: true, _count: { select: { problems: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getAllPatternsAdmin() {
  return prisma.pattern.findMany({
    select: { id: true, name: true, slug: true, description: true, _count: { select: { problems: true } } },
    orderBy: { name: "asc" },
  });
}

export async function createTopic(name: string) {
  return prisma.topic.create({ data: { name, slug: slugify(name) } });
}

export async function createPattern(name: string, description?: string) {
  return prisma.pattern.create({ data: { name, slug: slugify(name), description } });
}