export interface FeaturedArticles {
  image: string;
  title: string;
  body: string;
  altText: string;
  path: string;
}

export interface FeaturedCategories {
  categories: string;
  articles: FeaturedArticles[];
}

export const featuredContentBanner = {
  image: '',
  altText: '',
  title: 'Featured Content',
  subtitle: 'A Collection of Current Data-related Government Spending Topics',
};

export const featuredContentLanding: FeaturedCategories[] = [
         {
           categories: 'Historic Data',
           articles: [
             {
               image: '',
               title: 'The Story of Data Transparency',
               body:
                 'From the very beginning, transparency into government finances has been a critical part of government accounting. ' +
                 'Learn more about the history of US data in this feature.',
               altText: '',
               path: '/featured-content/story-of-data-transparency/',
             },
           ],
         },
       ];
