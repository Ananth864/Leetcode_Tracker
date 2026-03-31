import { NavLink } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Table01Icon, Radio01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Radio01Icon, label: 'Random Picker' },
  { to: '/tracker', icon: Table01Icon, label: 'Tracker' },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card min-h-screen p-4">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                isActive ? 'bg-primary text-primary-foreground' : 'text-foreground'
              )
            }
          >
            <HugeiconsIcon icon={item.icon} strokeWidth={2} className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
