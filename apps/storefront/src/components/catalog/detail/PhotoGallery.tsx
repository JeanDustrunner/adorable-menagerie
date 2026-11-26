import Image from 'next/image';
import type { Photos } from '../../../lib/catalog';
import { photoSrc } from '../../../lib/catalog/presentation';
import styles from './Detail.module.css';

/** All photos, cover first and large (the page's LCP), the rest as thumbnails. */
export function PhotoGallery({ photos }: { readonly photos: Photos }) {
  const [cover, ...rest] = photos;
  return (
    <div className={styles.gallery}>
      <Image
        src={photoSrc(cover)}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        sizes="(max-width: 767px) 100vw, 50vw"
        loading="eager"
        fetchPriority="high"
        className={styles.cover}
      />
      {rest.length > 0 && (
        <ul className={styles.thumbs}>
          {rest.map((photo) => (
            <li key={photo.file}>
              <Image
                src={photoSrc(photo)}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 767px) 33vw, 17vw"
                className={styles.thumb}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
