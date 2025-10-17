export interface AuthResponse {
  token: string;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  category: ICategory;
}

export interface ICategory {
  id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  description: string | null;
}
