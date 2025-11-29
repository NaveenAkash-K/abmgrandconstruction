interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export function generateMetadata({
  title = 'ABM GRAND CONSTRUCTION',
  description = 'Premier construction company delivering exceptional quality and innovative solutions',
  keywords = 'construction, building, residential, commercial',
  noindex = false,
  nofollow = false,
}: SEOProps = {}) {
  return {
    title,
    description,
    keywords,
    robots: {
      index: !noindex,
      follow: !nofollow,
    },
  };
}