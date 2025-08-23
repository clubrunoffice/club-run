import React, { useState } from 'react';
import { Star, MessageSquare, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface RatingData {
  id: string;
  missionId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  review: string;
  categories: {
    professionalism: number;
    communication: number;
    quality: number;
    timeliness: number;
  };
  tags: string[];
  isPublic: boolean;
  timestamp: string;
  response?: string;
}

interface RatingReviewSystemProps {
  missionId: string;
  fromUserId: string;
  toUserId: string;
  userRole: 'CLIENT' | 'RUNNER';
  onRatingSubmitted: (rating: RatingData) => void;
  onCancel: () => void;
}

const RatingReviewSystem: React.FC<RatingReviewSystemProps> = ({
  missionId,
  fromUserId,
  toUserId,
  userRole,
  onRatingSubmitted,
  onCancel
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [categories, setCategories] = useState({
    professionalism: 0,
    communication: 0,
    quality: 0,
    timeliness: 0
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryLabels = {
    professionalism: 'Professionalism',
    communication: 'Communication',
    quality: 'Quality of Service',
    timeliness: 'Timeliness'
  };

  const availableTags = userRole === 'CLIENT' ? [
    'Great communication',
    'Professional setup',
    'Excellent music selection',
    'On time',
    'Flexible with changes',
    'High energy',
    'Crowd engagement',
    'Equipment quality',
    'Would recommend',
    'Exceeded expectations'
  ] : [
    'Clear instructions',
    'Fair payment',
    'Good communication',
    'Professional venue',
    'Reasonable expectations',
    'On time payment',
    'Would work again',
    'Great experience',
    'Well organized',
    'Friendly client'
  ];

  const handleCategoryChange = (category: keyof typeof categories, value: number) => {
    setCategories(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const ratingData: RatingData = {
        id: `rating-${Date.now()}`,
        missionId,
        fromUserId,
        toUserId,
        rating,
        review,
        categories,
        tags: selectedTags,
        isPublic,
        timestamp: new Date().toISOString()
      };

      onRatingSubmitted(ratingData);
    } catch (error) {
      console.error('Rating submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = rating > 0 && review.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Rate Your Experience</h2>
            <p className="text-gray-600 mt-1">
              Help improve the community by sharing your feedback
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overall Rating */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Rating</h3>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-2 rounded-lg transition-colors ${
                  star <= rating
                    ? 'text-yellow-400 hover:text-yellow-500'
                    : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                <Star className="w-8 h-8 fill-current" />
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {rating === 0 && 'Select a rating'}
            {rating === 1 && 'Poor - Very dissatisfied'}
            {rating === 2 && 'Fair - Somewhat dissatisfied'}
            {rating === 3 && 'Good - Satisfied'}
            {rating === 4 && 'Very Good - Very satisfied'}
            {rating === 5 && 'Excellent - Extremely satisfied'}
          </p>
        </div>

        {/* Category Ratings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Specific Categories</h3>
          <div className="space-y-4">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleCategoryChange(key as keyof typeof categories, star)}
                      className={`p-1 rounded transition-colors ${
                        star <= categories[key as keyof typeof categories]
                          ? 'text-yellow-400 hover:text-yellow-500'
                          : 'text-gray-300 hover:text-gray-400'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder={`Share your experience with this ${userRole === 'CLIENT' ? 'runner' : 'client'}...`}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              {review.length}/500 characters
            </p>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Public review</span>
            </div>
          </div>
        </div>

        {/* Quick Tags */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tags</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Review Privacy</h4>
                <p className="text-sm text-gray-600">
                  {isPublic ? 'This review will be visible to everyone' : 'This review will be private'}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Rating Guidelines */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">Rating Guidelines</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Be honest and constructive in your feedback</li>
                <li>• Focus on the service quality and experience</li>
                <li>• Avoid personal attacks or inappropriate content</li>
                <li>• Your review helps improve the community</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Submit Rating</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingReviewSystem;
