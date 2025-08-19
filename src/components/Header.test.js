import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

// Mock the logo image
jest.mock('./Header', () => {
  const MockHeader = ({ children, ...props }) => <div {...props}>{children}</div>;
  return MockHeader;
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  test('renders company logo', () => {
    renderWithRouter(<Header />);
    const logo = screen.getByAltText('Company logo');
    expect(logo).toBeInTheDocument();
    expect(logo.src).toContain('/Logo.svg');
  });

  test('renders navigation links', () => {
    renderWithRouter(<Header />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About us')).toBeInTheDocument();
    expect(screen.getByText('Contact us')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  test('renders mobile menu button', () => {
    renderWithRouter(<Header />);
    const mobileMenuBtn = screen.getByLabelText('Toggle mobile menu');
    expect(mobileMenuBtn).toBeInTheDocument();
  });

  test('toggles mobile menu when button is clicked', () => {
    renderWithRouter(<Header />);
    const mobileMenuBtn = screen.getByLabelText('Toggle mobile menu');
    
    // Initially menu should be closed
    expect(screen.getByRole('navigation')).not.toHaveClass('nav-open');
    
    // Click to open
    fireEvent.click(mobileMenuBtn);
    expect(screen.getByRole('navigation')).toHaveClass('nav-open');
    
    // Click to close
    fireEvent.click(mobileMenuBtn);
    expect(screen.getByRole('navigation')).not.toHaveClass('nav-open');
  });

  test('closes mobile menu when navigation link is clicked', () => {
    renderWithRouter(<Header />);
    const mobileMenuBtn = screen.getByLabelText('Toggle mobile menu');
    const aboutLink = screen.getByText('About us');
    
    // Open menu
    fireEvent.click(mobileMenuBtn);
    expect(screen.getByRole('navigation')).toHaveClass('nav-open');
    
    // Click navigation link
    fireEvent.click(aboutLink);
    expect(screen.getByRole('navigation')).not.toHaveClass('nav-open');
  });

  test('closes mobile menu when logo is clicked', () => {
    renderWithRouter(<Header />);
    const mobileMenuBtn = screen.getByLabelText('Toggle mobile menu');
    const logo = screen.getByAltText('Company logo');
    
    // Open menu
    fireEvent.click(mobileMenuBtn);
    expect(screen.getByRole('navigation')).toHaveClass('nav-open');
    
    // Click logo
    fireEvent.click(logo);
    expect(screen.getByRole('navigation')).not.toHaveClass('nav-open');
  });
}); 