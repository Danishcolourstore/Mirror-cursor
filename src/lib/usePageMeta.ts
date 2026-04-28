import { useEffect } from 'react'

type MetaOptions = {
  title: string
  description?: string
  image?: string
  url?: string
}

function setMeta(name: string, content: string, property = false) {
  const selector = property
    ? `meta[property="${name}"]`
    : `meta[name="${name}"]`
  let el = document.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    if (property) el.setAttribute('property', name)
    else el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function usePageMeta({ title, description, image, url }: MetaOptions) {
  useEffect(() => {
    const prev = document.title
    document.title = title

    if (description) {
      setMeta('description', description)
      setMeta('og:description', description, true)
      setMeta('twitter:description', description)
    }

    if (image) {
      setMeta('og:image', image, true)
      setMeta('twitter:image', image)
      setMeta('twitter:card', 'summary_large_image')
    }

    setMeta('og:title', title, true)
    setMeta('twitter:title', title)

    if (url) {
      setMeta('og:url', url, true)
    }

    setMeta('og:type', 'website', true)
    setMeta('og:site_name', 'Mirror Studio', true)

    return () => {
      document.title = prev
    }
  }, [title, description, image, url])
}
