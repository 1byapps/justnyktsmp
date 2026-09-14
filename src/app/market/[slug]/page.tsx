import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './ProductDetailClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, shortDescription: true, description: true },
  });

  if (!product) {
    return { title: 'Ürün Bulunamadı | JustNyktSMP' };
  }

  return {
    title: `${product.name} | Market | JustNyktSMP`,
    description: product.shortDescription || product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <ProductDetailClient
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            shortDescription: product.shortDescription,
            price: product.price,
            discountPrice: product.discountPrice,
            imageUrl: product.imageUrl,
            category: product.category,
          }}
        />
      </div>
    </div>
  );
}
