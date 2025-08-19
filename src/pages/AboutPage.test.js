import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AboutPage from './AboutPage';

// Mock window.scrollTo
const mockScrollTo = jest.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AboutPage Component', () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
  });

  test('renders about us title', () => {
    renderWithRouter(<AboutPage />);
    expect(screen.getByText('About us')).toBeInTheDocument();
  });

  test('renders about content paragraphs', () => {
    renderWithRouter(<AboutPage />);
    
    expect(screen.getByText(/Populo facilisi nam no/)).toBeInTheDocument();
    expect(screen.getByText(/Lorem ipsum dolor sit amet/)).toBeInTheDocument();
    expect(screen.getByText(/Quisque non lectus dolor/)).toBeInTheDocument();
    expect(screen.getByText(/Integer ullamcorper nisi non/)).toBeInTheDocument();
  });

  test('renders office image', () => {
    renderWithRouter(<AboutPage />);
    const officeImage = screen.getByAltText('Modern office space with colorful furniture and exposed wooden beams');
    expect(officeImage).toBeInTheDocument();
    expect(officeImage.src).toContain('/office-1.jpg');
  });

  test('renders subheading and bulleted list', () => {
    renderWithRouter(<AboutPage />);
    
    expect(screen.getByText('Taria duo ut vis semper abhorreant:')).toBeInTheDocument();
    
    // Check bullet points
    expect(screen.getByText(/Te pri efficiendi assueverit/)).toBeInTheDocument();
    expect(screen.getByText(/Te nam dolorem rationibus repudiandae/)).toBeInTheDocument();
    expect(screen.getByText(/Ut qui dicant copiosae interpretaris/)).toBeInTheDocument();
    expect(screen.getByText(/Ut indoctum patrioque voluptaria duo/)).toBeInTheDocument();
  });

  test('renders link in content', () => {
    renderWithRouter(<AboutPage />);
    const link = screen.getByText('Praesent varius porta blandit mollis');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  test('scrolls to top when component mounts', () => {
    renderWithRouter(<AboutPage />);
    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
  });

  test('has proper heading hierarchy', () => {
    renderWithRouter(<AboutPage />);
    
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('About us');
    
    const subHeading = screen.getByRole('heading', { level: 2 });
    expect(subHeading).toHaveTextContent('Taria duo ut vis semper abhorreant:');
  });

  test('renders with proper CSS classes', () => {
    renderWithRouter(<AboutPage />);
    
    const aboutPage = screen.getByText('About us').closest('.about-page');
    expect(aboutPage).toBeInTheDocument();
    
    const aboutContent = screen.getByText('About us').closest('.about-content');
    expect(aboutContent).toBeInTheDocument();
  });
}); 