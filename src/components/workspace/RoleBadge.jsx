import React from 'react';
import { BadgeEuro, Bike, ChefHat, Crown, ShieldCheck, UtensilsCrossed } from 'lucide-react';

const icons = { waiter: UtensilsCrossed, kitchen: ChefHat, cashier: BadgeEuro, delivery: Bike, manager: ShieldCheck, superadmin: Crown };

export default function RoleBadge({ role, label, active = false }) {
  const Icon = icons[role] || ShieldCheck;
  return <span className={`workspace-role-badge ${active ? 'is-active' : ''}`}><Icon />{label || role}</span>;
}
