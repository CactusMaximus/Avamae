import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ContactPage from './ContactPage';

// Mock the API models
jest.mock('../models/apiModels', () => ({
  createContactUsCommand: jest.fn(() => ({
    validate: jest.fn(() => []),
    toJSON: jest.fn(() => ({})),
  })),
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

describe('ContactPage Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    jest.clearAllMocks();
  });

  test('renders contact form title and intro', () => {
    renderWithRouter(<ContactPage />);
    
    expect(screen.getByText('Contact us')).toBeInTheDocument();
    expect(screen.getByText(/Fusce efficitur eu purus ac posuere/)).toBeInTheDocument();
  });

  test('renders all form fields', () => {
    renderWithRouter(<ContactPage />);
    
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone number 01 - optional')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByLabelText('Add address details')).toBeInTheDocument();
  });

  test('allows user to input data in form fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ContactPage />);
    
    const nameInput = screen.getByLabelText('Full name');
    const emailInput = screen.getByLabelText('Email address');
    const messageInput = screen.getByLabelText('Message');
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'Test message');
    
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(messageInput.value).toBe('Test message');
  });

  test('adds new phone number field when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ContactPage />);
    
    const addButton = screen.getByText('Add new phone number');
    await user.click(addButton);
    
    // Should now have 2 phone number fields
    const phoneInputs = screen.getAllByPlaceholderText('Enter phone number');
    expect(phoneInputs).toHaveLength(2);
  });

  test('removes phone number field when remove button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ContactPage />);
    
    // Add a phone number first
    const addButton = screen.getByText('Add new phone number');
    await user.click(addButton);
    
    // Should have 2 phone fields now
    let phoneInputs = screen.getAllByPlaceholderText('Enter phone number');
    expect(phoneInputs).toHaveLength(2);
    
    // Remove the second one
    const removeButtons = screen.getAllByText('Remove');
    await user.click(removeButtons[1]);
    
    // Should be back to 1 phone field
    phoneInputs = screen.getAllByPlaceholderText('Enter phone number');
    expect(phoneInputs).toHaveLength(1);
  });

  test('shows address details section when checkbox is checked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ContactPage />);
    
    const addressCheckbox = screen.getByLabelText('Add address details');
    await user.click(addressCheckbox);
    
    expect(screen.getByText('Address Details')).toBeInTheDocument();
    expect(screen.getByLabelText('Address Line 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Address Line 2')).toBeInTheDocument();
    expect(screen.getByLabelText('City/Town')).toBeInTheDocument();
    expect(screen.getByLabelText('State/County')).toBeInTheDocument();
    expect(screen.getByLabelText('Postcode')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
  });

  test('hides address details section when checkbox is unchecked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ContactPage />);
    
    const addressCheckbox = screen.getByLabelText('Add address details');
    
    // Check to show
    await user.click(addressCheckbox);
    expect(screen.getByText('Address Details')).toBeInTheDocument();
    
    // Uncheck to hide
    await user.click(addressCheckbox);
    expect(screen.queryByText('Address Details')).not.toBeInTheDocument();
  });

  test('displays character count for message field', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ContactPage />);
    
    const messageInput = screen.getByLabelText('Message');
    await user.type(messageInput, 'Hello');
    
    expect(screen.getByText('Maximum text length is 1000 characters')).toBeInTheDocument();
  });

  test('submits form successfully', async () => {
    const user = userEvent.setup();
    
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ Status: '1' })
    });
    
    renderWithRouter(<ContactPage />);
    
    // Fill required fields
    await user.type(screen.getByLabelText('Full name'), 'John Doe');
    await user.type(screen.getByLabelText('Email address'), 'john@example.com');
    await user.type(screen.getByLabelText('Message'), 'Test message');
    
    // Submit form
    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Thank you! Your message has been sent successfully.')).toBeInTheDocument();
    });
  });

  test('handles form submission error', async () => {
    const user = userEvent.setup();
    
    // Mock failed API response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ Message: 'API Error' })
    });
    
    renderWithRouter(<ContactPage />);
    
    // Fill required fields
    await user.type(screen.getByLabelText('Full name'), 'John Doe');
    await user.type(screen.getByLabelText('Email address'), 'john@example.com');
    await user.type(screen.getByLabelText('Message'), 'Test message');
    
    // Submit form
    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  test('clears success message when address checkbox is toggled', async () => {
    const user = userEvent.setup();
    
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ Status: '1' })
    });
    
    renderWithRouter(<ContactPage />);
    
    // Fill and submit form to get success message
    await user.type(screen.getByLabelText('Full name'), 'John Doe');
    await user.type(screen.getByLabelText('Email address'), 'john@example.com');
    await user.type(screen.getByLabelText('Message'), 'Test message');
    
    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Thank you! Your message has been sent successfully.')).toBeInTheDocument();
    });
    
    // Toggle address checkbox
    const addressCheckbox = screen.getByLabelText('Add address details');
    await user.click(addressCheckbox);
    
    // Success message should be cleared
    expect(screen.queryByText('Thank you! Your message has been sent successfully.')).not.toBeInTheDocument();
  });

  test('shows loading state during submission', async () => {
    const user = userEvent.setup();
    
    // Mock slow API response
    fetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({
      ok: true,
      json: async () => ({ Status: '1' })
    }), 100)));
    
    renderWithRouter(<ContactPage />);
    
    // Fill required fields
    await user.type(screen.getByLabelText('Full name'), 'John Doe');
    await user.type(screen.getByLabelText('Email address'), 'john@example.com');
    await user.type(screen.getByLabelText('Message'), 'Test message');
    
    // Submit form
    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);
    
    // Should show loading state
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
}); 