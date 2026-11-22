import Image from 'next/image';
import { Squiggle } from './animals';
import {
  cast,
  featuredStoryPiece,
  formatPrice,
  navLinks,
  pastWork,
  products,
} from './fixtures';
import type { Piece } from './fixtures';

interface PieceImageProps {
  readonly piece: Piece;
  readonly sizes: string;
  readonly priority?: boolean;
}

/** Fills its positioned parent; the parent decides the aspect ratio. */
function PieceImage({ piece, sizes, priority = false }: PieceImageProps) {
  const cover = piece.photos[0];
  return (
    <Image
      src={cover.src}
      alt={cover.alt}
      fill
      sizes={sizes}
      priority={priority}
      className="photo"
    />
  );
}

export function DemoNotice() {
  return (
    <p className="demo-notice">
      Strona demonstracyjna. Wszystkie produkty i dane są fikcyjne, niczego nie
      można tu kupić.
    </p>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-header__brand" href="#top">
        Adorable Menagerie
      </a>
      <nav className="site-nav" aria-label="Główna nawigacja">
        <ul>
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <details className="site-menu">
        <summary>Menu</summary>
        <ul>
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </details>
    </header>
  );
}

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__text">
        <h1 id="hero-title">Poznaj naszą menażerię</h1>
        <Squiggle />
        <p>
          Szydełkowe zwierzaki, każdy z własnym imieniem i historią. Wybierz
          gotową przytulankę albo wzór, żeby zrobić ją samodzielnie.
        </p>
        <div className="hero__actions">
          <a className="button button--primary" href="#katalog">
            Gotowe przytulanki
          </a>
          <a className="button button--secondary" href="#katalog">
            Wzory do zrobienia
          </a>
        </div>
      </div>
      <div className="cast" aria-label="Bohaterowie menażerii">
        {cast.map((piece, index) => (
          <figure
            key={piece.id}
            className={`cast__member ${
              index === 1 ? 'cast__member--large' : 'cast__member--small'
            }`}
          >
            <div className="cast__photo">
              <PieceImage
                piece={piece}
                sizes="(max-width: 767px) 30vw, 14vw"
                priority
              />
            </div>
            <figcaption>{piece.name.split(' ').slice(-1)[0]}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Catalog() {
  return (
    <section id="katalog" className="section" aria-labelledby="catalog-title">
      <div className="section__head">
        <h2 id="catalog-title">W pracowni teraz</h2>
        <a className="link" href="#katalog">
          Cały katalog
        </a>
      </div>
      <ul className="catalog">
        {products.map((piece) => (
          <li key={piece.id} className="card">
            <div className={`card__media tint-${piece.tint}`}>
              <PieceImage piece={piece} sizes="(max-width: 767px) 50vw, 25vw" />
            </div>
            <div className="card__body">
              <h3>{piece.name}</h3>
              <p className="card__summary">{piece.summary}</p>
              <p className="card__meta">
                <span className="card__price">
                  {formatPrice(piece.pricePln)}
                </span>
                <span className="card__note">{piece.note}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FeaturedStory() {
  const piece = featuredStoryPiece;
  const photo = piece.photos[1] ?? piece.photos[0];
  return (
    <section id="blog" className="story" aria-labelledby="story-title">
      <div className="story__text">
        <p className="story__kicker">Z bloga, 6 minut czytania</p>
        <h2 id="story-title">Jak powstaje Konik Karmel</h2>
        <p>
          Od szkicu w zeszycie, przez dobór bawełny, po ostatnie oczko przy
          uchu. Pokazujemy, ile pracy kryje się w jednej przytulance i dlaczego
          żadne dwa koniki nie są identyczne.
        </p>
        <a className="button button--inverse" href="#blog">
          Czytaj wpis
        </a>
      </div>
      <aside className="story__linked" aria-labelledby="linked-title">
        <h3 id="linked-title">W tym wpisie</h3>
        <div className={`linked-product tint-${piece.tint}`}>
          <div className="linked-product__photo">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="72px"
              className="photo"
            />
          </div>
          <div>
            <p className="linked-product__name">{piece.name}</p>
            <p className="linked-product__meta">
              {formatPrice(piece.pricePln)}, {piece.note.toLowerCase()}
            </p>
          </div>
        </div>
        <p className="story__tags">Tagi: amigurumi, koniki, bawełna</p>
      </aside>
    </section>
  );
}

export function PastWork() {
  return (
    <section id="galeria" className="section" aria-labelledby="gallery-title">
      <div className="section__head section__head--stacked">
        <div>
          <h2 id="gallery-title">Już w nowych domach</h2>
          <p className="section__lead">
            Prace, które znalazły właścicieli. Zostają w galerii, żeby było
            widać, co potrafimy.
          </p>
        </div>
        <a className="link" href="#galeria">
          Cała galeria
        </a>
      </div>
      <ul className="gallery">
        {pastWork.map((piece) => (
          <li key={piece.id} className="gallery__tile">
            <div className="gallery__photo">
              <PieceImage piece={piece} sizes="(max-width: 767px) 30vw, 14vw" />
            </div>
            <p className="gallery__name">{piece.name}</p>
            <p className="gallery__note">W nowym domu</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer id="kontakt" className="site-footer">
      <div>
        <p className="site-footer__brand">Adorable Menagerie</p>
        <p>
          Projekt demonstracyjny. Wszystkie produkty, ceny i dane są fikcyjne.
        </p>
      </div>
      <div>
        <p className="site-footer__title">Kontakt</p>
        <p>E-mail: adres zostanie dodany</p>
        <p>GitHub: link do repozytorium projektu</p>
      </div>
    </footer>
  );
}
