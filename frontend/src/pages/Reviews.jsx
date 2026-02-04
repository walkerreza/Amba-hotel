import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../component/layouts/Footer';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/ulasan/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Transform review data to include room and user details
        const reviewsWithDetails = await Promise.all(
          response.data.map(async (review) => {
            try {
              // Get room details
              const roomResponse = await axios.get(`http://localhost:5000/api/kamar/${review.id_kamar}`, {
                headers: { Authorization: `Bearer ${token}` }
              });

              // Get user details
              const userResponse = await axios.get(`http://localhost:5000/api/users/${review.user_id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });

              return {
                ...review,
                kamar: roomResponse.data,
                user: userResponse.data
              };
            } catch (error) {
              console.error('Error fetching details:', error);
              return review;
            }
          })
        );

        setReviews(reviewsWithDetails);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={`text-2xl ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#09453D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Calculate review statistics
  const totalReviews = reviews.length;
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const positiveReviews = reviews.filter(r => r.rating >= 4).length;
  const positivePercentage = totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Ulasan Tamu</h1>
            <button
              onClick={() => navigate(-1)}
              className="text-[#09453D] hover:text-[#09453D]/80"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>

      {/* Review Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#09453D]">
                {totalReviews}
              </div>
              <div className="text-gray-600">Total Ulasan</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#09453D]">
                {averageRating}
                <span className="text-xl">/5</span>
              </div>
              <div className="text-gray-600">Rating Rata-rata</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#09453D]">
                {positivePercentage}%
              </div>
              <div className="text-gray-600">Ulasan Positif</div>
            </div>
          </div>
        </div>

        {/* Review List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-6 transition-transform hover:scale-[1.02]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{review.user?.nama || 'Anonim'}</h3>
                  <p className="text-sm text-gray-500">
                    Kamar {review.kamar?.nomor_kamar} - {review.kamar?.tipe_kamar}
                  </p>
                  <div className="flex gap-1 my-2">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <p className="mt-4 text-gray-700">{review.komentar}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Reviews;
