export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  category: string;
  image: string;
  imageHint: string;
  slug: string;
}

export interface CartItem extends Product {
  quantity: number;
}
