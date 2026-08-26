import React from 'react';
import { 
  Home, 
  Zap, 
  ShoppingCart, 
  Car, 
  ShieldCheck, 
  Activity, 
  Utensils, 
  Film, 
  ShoppingBag, 
  Tv, 
  Smile, 
  MoreHorizontal,
  Plane,
  Laptop,
  GraduationCap,
  TrendingUp,
  Gift,
  Heart,
  PiggyBank
} from 'lucide-react';
import { ExpenseCategory } from '../types';

interface CategoryIconProps {
  category?: ExpenseCategory | string;
  iconName?: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, iconName, className = "w-5 h-5", size = 20 }) => {
  // If iconName is passed directly
  if (iconName) {
    switch (iconName.toLowerCase()) {
      case 'shieldcheck':
      case 'shield':
        return <ShieldCheck className={className} size={size} />;
      case 'plane':
      case 'travel':
        return <Plane className={className} size={size} />;
      case 'laptop':
      case 'tech':
        return <Laptop className={className} size={size} />;
      case 'graduationcap':
      case 'education':
        return <GraduationCap className={className} size={size} />;
      case 'trendingup':
      case 'investment':
        return <TrendingUp className={className} size={size} />;
      case 'gift':
        return <Gift className={className} size={size} />;
      case 'heart':
        return <Heart className={className} size={size} />;
      default:
        return <PiggyBank className={className} size={size} />;
    }
  }

  // If category is passed
  switch (category) {
    case 'housing':
      return <Home className={className} size={size} />;
    case 'utilities':
      return <Zap className={className} size={size} />;
    case 'groceries':
      return <ShoppingCart className={className} size={size} />;
    case 'transport':
      return <Car className={className} size={size} />;
    case 'insurance':
      return <ShieldCheck className={className} size={size} />;
    case 'health':
      return <Activity className={className} size={size} />;
    case 'dining':
      return <Utensils className={className} size={size} />;
    case 'entertainment':
      return <Film className={className} size={size} />;
    case 'shopping':
      return <ShoppingBag className={className} size={size} />;
    case 'subscriptions':
      return <Tv className={className} size={size} />;
    case 'personal':
      return <Smile className={className} size={size} />;
    case 'other':
    default:
      return <MoreHorizontal className={className} size={size} />;
  }
};
