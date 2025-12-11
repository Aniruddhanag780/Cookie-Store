'use client';

import React, { useState, useMemo } from 'react';
import type { Product } from '@/lib/types';
import ProductCard from './product-card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';
import { categories } from '@/lib/products';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase().trim();
    if (!lowercasedSearchTerm && selectedCategory === 'All') {
      return products;
    }

    const searchWords = lowercasedSearchTerm.split(/\s+/).filter(Boolean);

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      if (!matchesCategory) {
        return false;
      }

      if (searchWords.length === 0) {
        return true;
      }
      
      const productText = `${product.name.toLowerCase()} ${product.description.toLowerCase()}`;

      return searchWords.every(word => productText.includes(word));
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === 'All' ? 'default' : 'secondary'}
            onClick={() => setSelectedCategory('All')}
            className="rounded-full flex-shrink-0"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'secondary'}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full flex-shrink-0"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in opacity-0"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 col-span-full">
          <p className="text-xl text-muted-foreground">No products found.</p>
        </div>
      )}
    </div>
  );
}
