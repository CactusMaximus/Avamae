import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { createBannerViewModel, BannerItem } from '../models/apiModels';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [carouselData, setCarouselData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCarouselData();
  }, []);

  const fetchCarouselData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://interview-assessment.api.avamae.co.uk/api/v1/home/banner-details');
      
      if (!response.ok) {
        throw new Error('Failed to fetch carousel data');
      }
      
      const data = await response.json();
      
      // Use the proper API model to handle the response
      const bannerViewModel = createBannerViewModel(data);
      
      if (bannerViewModel.isSuccess() && bannerViewModel.Details && bannerViewModel.Details.length > 0) {
        // Filter out items without valid data
        const validItems = bannerViewModel.Details.filter(item => item.hasValidData());
        setCarouselData(validItems);
      } else if (bannerViewModel.hasErrors()) {
        const errorMessages = bannerViewModel.Errors.map(err => err.MessageCode).join(', ');
        throw new Error(`API returned errors: ${errorMessages}`);
      } else {
        throw new Error('No valid banner data received from API');
      }
    } catch (err) {
      setError(err.message);
      // Set fallback data if API fails
      setCarouselData([
        new BannerItem({
          Title: 'Welcome to AVAMAE',
          Subtitle: 'Professional software solutions for modern businesses',
          ImageUrl: 'https://via.placeholder.com/800x600/4a90e2/ffffff?text=Office+Image'
        })
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading content</h2>
        <p>{error}</p>
        <button onClick={fetchCarouselData} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Carousel Section */}
      <section className="hero-section">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="hero-swiper"
        >
          {carouselData.map((slide, index) => (
            <SwiperSlide key={index} className="hero-slide">
              <div className="hero-content">
                <div className="hero-text-overlay">
                  <h1 className="hero-title">{slide.Title || 'Lorem ipsum dolor'}</h1>
                  <p className="hero-subtitle">
                    {slide.Subtitle || 'Quem vide tincidunt pri ei, id mea omnium denique.'}
                  </p>
                  <button 
                    className="btn btn-primary hero-cta"
                    onClick={() => navigate('/contact-us')}
                  >
                    Contact us
                  </button>
                </div>
                <div className="hero-image-container">
                  <img 
                    src={slide.ImageUrl || 'https://via.placeholder.com/800x600/4a90e2/ffffff?text=Office+Image'} 
                    alt={slide.Title || 'Hero image'}
                    className="hero-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x600/4a90e2/ffffff?text=Office+Image';
                    }}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          <div className="content-grid">
            <div className="content-text">
              <h2 className="content-title">
                Justo petentium te vix, scripta regione urbanitas
              </h2>
              <p className="content-paragraph">
                Populo facilisi nam no, dolor deleniti deseruisse ne cum, nam quodsi aliquam eligendi ne. 
                Ferri euismod accusata te nec, summo accumsan at vix. Praesent varius porta blandit mollis.
              </p>
              <ul className="content-list">
                <li>Te pri efficiendi assueverit id molestie suavitate per</li>
                <li>Ea vim graeco principes, cu eos cetero argumentum</li>
                <li>Ut meliore verterem pro, vim an vidit putent</li>
                <li>Ea mei nullam facete, omnis oratio ex nam</li>
              </ul>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/about-us')}
              >
                Learn more
              </button>
            </div>
            <div className="content-image">
              <img 
                src="https://via.placeholder.com/600x400/ff6b35/ffffff?text=Modern+Office+Space" 
                alt="Modern office space with colorful furniture"
                className="office-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400/ff6b35/ffffff?text=Modern+Office+Space';
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 