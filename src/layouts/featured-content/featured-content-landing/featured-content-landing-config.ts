export interface FeaturedArticle {
  title: string;
  body: string;
  image: string; // PNG "name" in /static/images (no extension)
  altText: string;
  path: string; // e.g. '/featured-content/story-of-data-transparency/'
  analyticsName: string;
}

export interface FeaturedCategory {
  category: string;
  articles: FeaturedArticle[];
}

export const featuredContentBanner = {
  image: 'featured-content-banner',
  altText: 'Featured Content',
};

export const featuredContentLanding: FeaturedCategory[] = [
  {
    category: 'Historic Data',
    articles: [
      {
        title: 'The Story of Data Transparency',
        body: 'From the very beginning, transparency into government finances has been a critical part of government accounting.',
        image: 'story-of-data-transparency',
        altText: 'The Story of Data Transparency',
        path: '/featured-content/story-of-data-transparency/',
        analyticsName: 'The Story of Data Transparency',
      },
    ],
  },
];

export default featuredContentLanding;
