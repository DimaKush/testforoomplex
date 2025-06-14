import { memo } from 'react';
import { Review } from '@/types';
import { sanitizeHtml } from '@/utils/sanitize';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = memo<ReviewCardProps>(function ReviewCard({ review }) {
  return (
    <div 
      className="text-center"
      itemScope
      itemType="https://schema.org/Review"
    >
      <div 
        className="prose prose-lg max-w-none text-gray-700 leading-relaxed text-lg"
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(review.text)
        }}
        itemProp="reviewBody"
      />
      
      {/* Hidden schema.org data */}
      <div itemProp="author" itemScope itemType="https://schema.org/Person" style={{ display: 'none' }}>
        <meta itemProp="name" content="Клиент" />
      </div>
      <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating" style={{ display: 'none' }}>
        <meta itemProp="ratingValue" content="5" />
        <meta itemProp="bestRating" content="5" />
        <meta itemProp="worstRating" content="1" />
      </div>
      <div itemProp="itemReviewed" itemScope itemType="https://schema.org/Organization" style={{ display: 'none' }}>
        <meta itemProp="name" content={process.env['NEXT_PUBLIC_SITE_NAME'] || 'Интернет-магазин'} />
      </div>
      <meta itemProp="datePublished" content="2024-01-01T00:00:00.000Z" />
    </div>
  );
}); 