/**
 * Drives the Featured Content landing page (/featured-content/).
 *
 * To add a new article: add an object to the `articles` array of the relevant category.
 * To add a new category/section: add a new object to `featuredContentLanding`.
 *
 * `image` is the file name (without extension) of a PNG in /static/images. It is matched
 * against the Gatsby `allFile` image query by name, exactly like the home page tiles
 * (see pageTileMap in src/components/topics-section/homepage-tile/homepage-tile-helper.js).
 */

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

// Full-width banner across the top of the landing page.
// TODO: replace with the final banner asset (drop the PNG in /static/images and update both fields).
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
