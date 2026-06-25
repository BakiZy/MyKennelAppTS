import { Helmet } from "react-helmet-async";
import type React from "react";

type SeoProps = {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  type?: "website" | "profile";
  robots?: string;
  structuredData?: object | object[];
};

const defaultImage = "https://i.imgur.com/6Ll5PQL.jpeg";

const Seo: React.FC<SeoProps> = ({
  title,
  description,
  canonical,
  image = defaultImage,
  type = "website",
  robots = "index,follow",
  structuredData,
}) => {
  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta name="referrer" content="origin-when-crossorigin" />
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default Seo;
