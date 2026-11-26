import { paragraphs } from '../../../lib/catalog/presentation';

/** Plain-text description, one paragraph per blank-line-separated block. */
export function Description({ text }: { readonly text: string }) {
  return (
    <>
      {paragraphs(text).map((paragraph, index) => (
        // Static text that never reorders, so the index is a stable key.
        <p key={index}>{paragraph}</p>
      ))}
    </>
  );
}
