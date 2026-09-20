import { User, Product, Order, Cart, CartItem, Category } from "@prisma/client";

export type { User, Product, Order, Cart, CartItem, Category };

export type ProductWithCategory = Product & {
  category: Category | null;
};

export type CartWithItems = Cart & {
  items: (CartItem & {
    product: Product;
  })[];
};

export type OrderWithItems = Order & {
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
  }[];
};

