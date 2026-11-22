import type { Post } from '../types';

// Frontmatter only. The Markdown bodies arrive with the blog pipeline (T1.6).

export const posts: readonly Post[] = [
  {
    slug: 'smoki-w-menazerii',
    title: 'Smoki w menażerii',
    publishedOn: '2026-11-20',
    excerpt:
      'Dwa smoki, dwa zupełnie różne charaktery: szary Popiołek i błękitny Szafir. Opowiadamy, jak powstawały skrzydła.',
    tags: ['smoki', 'fantasy'],
    relatedItems: ['smok-szafir', 'smok-popiolek'],
    relatedPatterns: ['wzor-smok-szafir'],
    readingMinutes: 5,
  },
  {
    slug: 'jak-powstaje-konik-karmel',
    title: 'Jak powstaje Konik Karmel',
    publishedOn: '2026-11-15',
    excerpt:
      'Od szkicu w zeszycie, przez dobór bawełny, po ostatnie oczko przy uchu: kulisy pracy nad jednym konikiem.',
    tags: ['konie', 'bawelna', 'amigurumi'],
    relatedItems: ['konik-karmel'],
    relatedPatterns: ['wzor-konik-karmel'],
    readingMinutes: 6,
  },
  {
    slug: 'jaka-wloczka-na-pierwsza-przytulanke',
    title: 'Jaką włóczkę wybrać na pierwszą przytulankę',
    publishedOn: '2026-10-28',
    excerpt:
      'Bawełna, akryl czy mieszanka? Porównujemy miękkość, trwałość i łatwość prania.',
    tags: ['bawelna', 'poczatkujacy'],
    relatedItems: [],
    relatedPatterns: ['wzor-szalik-menazeria'],
    readingMinutes: 4,
  },
  {
    slug: 'pielegnacja-szydelkowych-zabawek',
    title: 'Pielęgnacja szydełkowych zabawek',
    publishedOn: '2026-10-05',
    excerpt:
      'Pranie ręczne, suszenie i przechowywanie, żeby przytulanka służyła latami.',
    tags: ['bawelna', 'pielegnacja'],
    relatedItems: [],
    relatedPatterns: [],
    readingMinutes: 3,
  },
  {
    slug: 'lamy-roberto-i-rosa',
    title: 'Lamy Roberto i Rosa',
    publishedOn: '2026-09-30',
    excerpt:
      'Dwie lamy z dwóch rodzajów włóczki. Dlaczego pluszowa jest przyjemna w dotyku, ale trudna w robocie.',
    tags: ['lamy', 'plusz'],
    relatedItems: ['lama-roberto', 'lama-rosa'],
    relatedPatterns: ['wzor-lama-roberto'],
    readingMinutes: 4,
  },
];
