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
           category: 'HISTORIC DATA',
           articles: [
             {
               title: 'Historic Data Now Available',
               body: 'Federal receipts and expenditure data dating back to 1793 is now available for the first time on FiscalData.Treasury.gov.',
               image: 'historic-data-now-available',
               altText: 'Historic Data Now Available',
               path: '/featured-content/historic-data-now-available/',
               analyticsName: 'Historic Data Now Available',
             },
             {
               title: 'The Story of Data Transparency',
               body: 'From the very beginning, transparency into government finances has been a critical part of government accounting.',
               image: 'story-of-data-transparency',
               altText: 'The Story of Data Transparency',
               path: '/featured-content/story-of-data-transparency/',
               analyticsName: 'The Story of Data Transparency',
             },
             {
               title: 'See Historic Government Spending',
               body:
                 'Ever been curious about how the early U.S. government spent money? The Account of the Receipts and Expenditures of the U.S. ' +
                 'Government has all the details!',
               image: 'historic-government-spending',
               altText: 'See Historic Government Spending',
               path: '/featured-content/historic-govt-spending/',
               analyticsName: 'See Historic Government Spending',
             },
           ],
         },
       ];

export default featuredContentLanding;
