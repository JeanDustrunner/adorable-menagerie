import Link from 'next/link';
import type { ReactNode } from 'react';

/** Decides whether a page at `href` exists yet (see `isSectionReady`). */
export type CanLink = (href: string) => boolean;

interface MaybeLinkProps {
  readonly href: string;
  readonly canLink: CanLink;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * A link while the target section exists, plain text before that, so the site
 * never links to a 404 while sections are still being built (spec section 3).
 * `className` styles the link only: plain text must not look clickable.
 */
export function MaybeLink({
  href,
  canLink,
  className,
  children,
}: MaybeLinkProps) {
  if (!canLink(href)) return <>{children}</>;
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
