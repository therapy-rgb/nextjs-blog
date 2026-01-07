interface JsonLdProps {
  data: Record<string, unknown>
}

/**
 * Safely renders JSON-LD structured data.
 * Escapes HTML special characters to prevent XSS attacks from CMS content.
 */
export default function JsonLd({ data }: JsonLdProps) {
  const safeJson = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  )
}