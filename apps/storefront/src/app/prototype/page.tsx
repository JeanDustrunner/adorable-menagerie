import {
  Catalog,
  DemoNotice,
  FeaturedStory,
  Hero,
  PastWork,
  SiteFooter,
  SiteHeader,
} from './sections';

export default function PrototypePage() {
  return (
    <>
      <DemoNotice />
      <span id="top" />
      <SiteHeader />
      <main>
        <Hero />
        <Catalog />
        <FeaturedStory />
        <PastWork />
      </main>
      <SiteFooter />
    </>
  );
}
