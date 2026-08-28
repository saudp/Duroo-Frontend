// ACF WYSIWYG fields return raw HTML (toolbar restricted to 'basic' in the
// field group, so this is editorial content from wp-admin, not arbitrary
// user input) — safe to render with dangerouslySetInnerHTML.

export default function RichText({
  html,
  className = '',
}: {
  html: string
  className?: string
}) {
  if (!html) return null

  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
