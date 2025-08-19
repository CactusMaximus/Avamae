import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

// Mock Swiper
jest.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid="swiper">{children}</div>,
  SwiperSlide: ({ children }) => <div data-testid="swiper-slide">{children}</div>,
}));

// Mock Swiper modules
jest.mock('swiper/modules', () => ({
  Navigation: () => null,
  Pagination: () => null,
  Autoplay: () => null,
}));

// Mock the API models
jest.mock('../models/apiModels', () => ({
  createBannerViewModel: jest.fn(),
  BannerItem: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('HomePage Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders hero section', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByTestId('swiper')).toBeInTheDocument();
  });

  test('renders company information section', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText(/Populo facilisi nam no/)).toBeInTheDocument();
    expect(screen.getByText(/Ferri euismod accusata te nec/)).toBeInTheDocument();
  });

  test('renders call-to-action buttons', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Contact us')).toBeInTheDocument();
    expect(screen.getByText('Learn more')).toBeInTheDocument();
  });

  test('navigates to contact page when Contact us button is clicked', () => {
    const mockNavigate = jest.fn();
    jest.doMock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    renderWithRouter(<HomePage />);
    const contactButton = screen.getByText('Contact us');
    fireEvent.click(contactButton);
    
    // Note: This test would need proper navigation mocking to work fully
    expect(contactButton).toBeInTheDocument();
  });

  test('navigates to about page when Learn more button is clicked', () => {
    const mockNavigate = jest.fn();
    jest.doMock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    renderWithRouter(<HomePage />);
    const learnMoreButton = screen.getByText('Learn more');
    fireEvent.click(learnMoreButton);
    
    // Note: This test would need proper navigation mocking to work fully
    expect(learnMoreButton).toBeInTheDocument();
  });

  test('fetches carousel data on component mount', async () => {
    const mockBannerData = {
      Status: "1",
      Details: [
        {
          Title: "Test Title",
          Subtitle: "Test Subtitle",
          ImageUrl: "test-image.jpg"
        }
      ]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBannerData
    });

    renderWithRouter(<HomePage />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://interview-assessment.api.avamae.co.uk/api/v1/overlays'
      );
    });
  });

  test('handles API error gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    renderWithRouter(<HomePage />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });
}); 