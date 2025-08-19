import React, { useEffect } from 'react';
import './AboutPage.css';

const AboutPage = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      <div className="container">
        <div className="about-content">
          <h1 className="about-title">About us</h1>
          
          <div className="about-text-section">
            <p className="about-paragraph">
              Populo facilisi nam no, dolor deleniti deseruisse ne cum, nam quodsi aliquam eligendi ne. 
              Ferri euismod accusata te nec, summo accumsan at vix.
            </p>
            <p className="about-paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc pulvinar enim sed quam efficitur finibus. 
              <a href="#" className="about-link">Praesent varius porta blandit mollis</a>.
            </p>
            <p className="about-paragraph">
              Quisque non lectus dolor. In id dictum ex. Aenean laoreet velit sem, in dictum orci cursus sit amet.
            </p>
          </div>

          <div className="about-image-section">
            <img 
              src="/office-1.jpg" 
              alt="Modern office space with colorful furniture and exposed wooden beams"
              className="about-office-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600/ff6b35/ffffff?text=Modern+Office+Space';
              }}
            />
          </div>

          <div className="about-text-section">
            <h2 className="about-subheading">Taria duo ut vis semper abhorreant:</h2>
            <ul className="about-list">
              <li>Te pri efficiendi assueverit, id molestie suavitate per</li>
              <li>Te nam dolorem rationibus repudiandae, ne ius falli aliquip consetetur</li>
              <li>Ut qui dicant copiosae interpretaris</li>
              <li>Ut indoctum patrioque voluptaria duo, ut vis semper abhorreant</li>
            </ul>
          </div>

          <div className="about-text-section">
            <p className="about-paragraph">
              Integer ullamcorper nisi non ultricies consequat. Mauris at ipsum vel erat fringilla placerat ut eget nibh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 