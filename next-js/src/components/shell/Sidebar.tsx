'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { DaryusLogo } from './DaryusLogo';
import styles from './Sidebar.module.css';

export interface NavLinkItem {
  type: 'link';
  label: string;
  href: string;
}

export interface NavGroupItem {
  type: 'group';
  label: string;
  children: NavLinkItem[];
}

export type NavItem = NavLinkItem | NavGroupItem;

/**
 * Modulos de navegacao do DSR. Um novo modulo (ex.: Escopometro como item
 * proprio, Documentos, Auditoria) e um novo item aqui — link direto ou grupo
 * com `children` — sem precisar alterar o componente.
 */
const NAV_ITEMS: NavItem[] = [
  { type: 'link', label: 'Dashboard', href: '/' },
  { type: 'link', label: 'Organizacoes', href: '/organizations' },
  { type: 'link', label: 'Projetos', href: '/projects' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function groupHasActiveChild(pathname: string, group: NavGroupItem) {
  return group.children.some((child) => isActive(pathname, child.href));
}

export function Sidebar() {
  const pathname = usePathname();

  // So guarda toggles explicitos do usuario; grupos ainda nao tocados
  // auto-expandem quando a rota atual e um dos filhos.
  const [openOverrides, setOpenOverrides] = useState<Record<string, boolean>>({});

  function toggleGroup(group: NavGroupItem) {
    setOpenOverrides((current) => ({
      ...current,
      [group.label]: !(current[group.label] ?? groupHasActiveChild(pathname, group)),
    }));
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <DaryusLogo variant="light" />
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          if (item.type === 'link') {
            return (
              <Link
                className={clsx(styles.link, isActive(pathname, item.href) && styles.linkActive)}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          }

          const isOpen = openOverrides[item.label] ?? groupHasActiveChild(pathname, item);

          return (
            <div className={styles.group} key={item.label}>
              <button
                aria-expanded={isOpen}
                className={styles.groupToggle}
                onClick={() => toggleGroup(item)}
                type="button"
              >
                <span>{item.label}</span>
                <span aria-hidden="true" className={clsx(styles.chevron, isOpen && styles.chevronOpen)}>
                  ▾
                </span>
              </button>

              {isOpen ? (
                <div className={styles.groupChildren}>
                  {item.children.map((child) => (
                    <Link
                      className={clsx(styles.childLink, isActive(pathname, child.href) && styles.linkActive)}
                      href={child.href}
                      key={child.href}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
