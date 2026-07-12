import coffeeImg from "@/assets/menu-coffee.jpg";
import cakeImg from "@/assets/menu-cake.jpg";
import teaImg from "@/assets/menu-tea.jpg";
import burgerImg from "@/assets/menu-burger.jpg";
import waterImg from "@/assets/menu-water.jpg";

export type MenuItem = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  image: string;
  description: string;
};

export const MENU: MenuItem[] = [
  {
    id: "coffee",
    name: "Coffee",
    emoji: "☕",
    price: 60,
    image: coffeeImg,
    description: "Freshly brewed, house blend.",
  },
  {
    id: "english-cake",
    name: "English Cake",
    emoji: "🍰",
    price: 120,
    image: cakeImg,
    description: "Buttery slice with dried fruit.",
  },
  {
    id: "tea",
    name: "Tea",
    emoji: "🍵",
    price: 40,
    image: teaImg,
    description: "Steeped black tea with lemon.",
  },
  {
    id: "special-burger",
    name: "Special Burger",
    emoji: "🍔",
    price: 850,
    image: burgerImg,
    description: "Signature burger, melted cheese.",
  },
  {
    id: "water-600",
    name: "600 ml Water",
    emoji: "💧",
    price: 30,
    image: waterImg,
    description: "Chilled bottled water.",
  },
];

export const menuById = Object.fromEntries(MENU.map((m) => [m.id, m]));
