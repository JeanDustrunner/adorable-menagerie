import { NotFoundContent } from '../components/shell/NotFoundContent';
import { visibleNavItems } from '../lib/navigation';

// A Server Component on purpose: the root not-found file is sent with every page.
export default function NotFound() {
  return <NotFoundContent items={visibleNavItems()} />;
}
