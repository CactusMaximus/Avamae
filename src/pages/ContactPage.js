import React, { useState } from 'react';
import { createContactUsCommand } from '../models/apiModels';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    FullName: '',
    EmailAddress: '',
    PhoneNumbers: [''],
    Message: '',
    bIncludeAddressDetails: false,
    AddressDetails: {
      AddressLine1: '',
      AddressLine2: '',
      CityTown: '',
      StateCounty: '',
      Postcode: '',
      Country: ''
    }
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear success message when address checkbox is toggled
    if (name === 'bIncludeAddressDetails') {
      setSubmitStatus(null);
    }
  };

  const handlePhoneChange = (index, value) => {
    const newPhoneNumbers = [...formData.PhoneNumbers];
    newPhoneNumbers[index] = value;
    setFormData(prev => ({ ...prev, PhoneNumbers: newPhoneNumbers }));
  };

  const addPhoneNumber = () => {
    setFormData(prev => ({
      ...prev,
      PhoneNumbers: [...prev.PhoneNumbers, '']
    }));
  };

  const removePhoneNumber = (index) => {
    if (formData.PhoneNumbers.length > 1) {
      const newPhoneNumbers = formData.PhoneNumbers.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, PhoneNumbers: newPhoneNumbers }));
    }
  };

  const validateForm = () => {
    // Use the API model for validation
    const contactCommand = createContactUsCommand(formData);
    const validationErrors = contactCommand.validate();
    
    const newErrors = {};
    validationErrors.forEach(error => {
      newErrors[error.FieldName] = error.getUserMessage();
    });

    setErrors(newErrors);
    return validationErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Use the API model to create the payload
      const contactCommand = createContactUsCommand(formData);
      const payload = contactCommand.toJSON();

      const response = await fetch('https://interview-assessment.api.avamae.co.uk/api/v1/contact-us/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          FullName: '',
          EmailAddress: '',
          PhoneNumbers: [''],
          Message: '',
          bIncludeAddressDetails: false,
          AddressDetails: {
            AddressLine1: '',
            AddressLine2: '',
            CityTown: '',
            StateCounty: '',
            Postcode: '',
            Country: ''
          }
        });
      } else {
        const errorData = await response.json();
        setSubmitStatus('error');
        
        setErrors({ submit: errorData.Message || 'Failed to submit form. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-content">
        <div className="contact-form-section">
          <h1 className="contact-title">Contact us</h1>
          <p className="contact-intro">
            Fusce efficitur eu purus ac posuere nean imperdiet risus dolor, nec accumsan velit ornare sit amet.
          </p>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Full name</label>
                <input
                  type="text"
                  id="fullName"
                  name="FullName"
                  value={formData.FullName}
                  onChange={handleInputChange}
                  className={`form-input ${errors.FullName ? 'error' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.FullName && <span className="error-message">{errors.FullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="EmailAddress"
                  value={formData.EmailAddress}
                  onChange={handleInputChange}
                  className={`form-input ${errors.EmailAddress ? 'error' : ''}`}
                  placeholder="Enter your email address"
                />
                {errors.EmailAddress && <span className="error-message">{errors.EmailAddress}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone number 01 - optional</label>
              {formData.PhoneNumbers.map((phone, index) => (
                <div key={index} className="phone-input-group">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    className="form-input"
                    placeholder="Enter phone number"
                  />
                  {formData.PhoneNumbers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhoneNumber(index)}
                      className="remove-phone-btn"
                      aria-label="Remove phone number"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPhoneNumber}
                className="add-phone-btn"
              >
                Add new phone number
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                id="message"
                name="Message"
                value={formData.Message}
                onChange={handleInputChange}
                className={`form-textarea ${errors.Message ? 'error' : ''}`}
                placeholder="Type your text here"
                rows="6"
              />
              <div className="char-count">
                Maximum text length is 1000 characters
              </div>
              {errors.Message && <span className="error-message">{errors.Message}</span>}
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="bIncludeAddressDetails"
                  checked={formData.bIncludeAddressDetails}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                Add address details
              </label>
            </div>

            {formData.bIncludeAddressDetails && (
              <div className="address-details-section">
                <h3 className="address-section-title">Address Details</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="addressLine1" className="form-label">Address Line 1</label>
                    <input
                      type="text"
                      id="addressLine1"
                      name="AddressDetails.AddressLine1"
                      value={formData.AddressDetails.AddressLine1}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        AddressDetails: {
                          ...prev.AddressDetails,
                          AddressLine1: e.target.value
                        }
                      }))}
                      className={`form-input ${errors.AddressLine1 ? 'error' : ''}`}
                      placeholder="Enter address line 1"
                    />
                    {errors.AddressLine1 && <span className="error-message">{errors.AddressLine1}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="addressLine2" className="form-label">Address Line 2</label>
                    <input
                      type="text"
                      id="addressLine2"
                      name="AddressDetails.AddressLine2"
                      value={formData.AddressDetails.AddressLine2}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        AddressDetails: {
                          ...prev.AddressDetails,
                          AddressLine2: e.target.value
                        }
                      }))}
                      className="form-input"
                      placeholder="Enter address line 2 (optional)"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cityTown" className="form-label">City/Town</label>
                    <input
                      type="text"
                      id="cityTown"
                      name="AddressDetails.CityTown"
                      value={formData.AddressDetails.CityTown}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        AddressDetails: {
                          ...prev.AddressDetails,
                          CityTown: e.target.value
                        }
                      }))}
                      className={`form-input ${errors.CityTown ? 'error' : ''}`}
                      placeholder="Enter city or town"
                    />
                    {errors.CityTown && <span className="error-message">{errors.CityTown}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="stateCounty" className="form-label">State/County</label>
                    <input
                      type="text"
                      id="stateCounty"
                      name="AddressDetails.StateCounty"
                      value={formData.AddressDetails.StateCounty}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        AddressDetails: {
                          ...prev.AddressDetails,
                          StateCounty: e.target.value
                        }
                      }))}
                      className={`form-input ${errors.StateCounty ? 'error' : ''}`}
                      placeholder="Enter state or county"
                    />
                    {errors.StateCounty && <span className="error-message">{errors.StateCounty}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="postcode" className="form-label">Postcode</label>
                    <input
                      type="text"
                      id="postcode"
                      name="AddressDetails.Postcode"
                      value={formData.AddressDetails.Postcode}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        AddressDetails: {
                          ...prev.AddressDetails,
                          Postcode: e.target.value
                        }
                      }))}
                      className={`form-input ${errors.Postcode ? 'error' : ''}`}
                      placeholder="Enter postcode"
                    />
                    {errors.Postcode && <span className="error-message">{errors.Postcode}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="country" className="form-label">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="AddressDetails.Country"
                      value={formData.AddressDetails.Country}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        AddressDetails: {
                          ...prev.AddressDetails,
                          Country: e.target.value
                        }
                      }))}
                      className={`form-input ${errors.Country ? 'error' : ''}`}
                      placeholder="Enter country"
                    />
                    {errors.Country && <span className="error-message">{errors.Country}</span>}
                  </div>
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="error-message submit-error">{errors.submit}</div>
            )}

            {submitStatus === 'success' && (
              <div className="success-message">
                Thank you! Your message has been sent successfully.
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="submit-spinner"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <span className="submit-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false" role="img" aria-label="paper plane">
                      <path d="M22 2 11 13"/>
                      <path d="M22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </span>
                  Submit
                </>
              )}
            </button>
          </form>
        </div>

        <aside className="contact-graphic">
          <img
            src="/helix-logo.png"
            alt="Helix logo"
            className="contact-helix"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </aside>

      </div>
    </div>
  );
};

export default ContactPage; 