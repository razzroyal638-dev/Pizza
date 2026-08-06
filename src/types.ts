export interface MenuItem {
  category: string;
  name: string;
  description: string;
  regular: string;
  medium: string;
  large: string;
  single: string;
}

export interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: string;
}
