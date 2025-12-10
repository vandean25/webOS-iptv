import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from '../../App';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

// Mock axios to ensure we don't make real network requests
vi.mock('axios');

describe('Integration: Login Flow with Mock Bypass', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
    (axios.get as any).mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should allow login with demo credentials and redirect to dashboard', async () => {
    await act(async () => {
      render(<App />);
    });

    // 1. Verify we are on Login Page
    expect(screen.getByText('Modern IPTV')).toBeInTheDocument();

    // 2. Fill in Credentials
    const urlInput = screen.getByPlaceholderText('http://example.com');
    const userInput = screen.getByPlaceholderText('Username');
    const passInput = screen.getByPlaceholderText('Password');
    const loginBtn = screen.getByText('Login');

    fireEvent.change(urlInput, { target: { value: 'http://mock.test' } });
    fireEvent.change(userInput, { target: { value: 'demo' } });
    fireEvent.change(passInput, { target: { value: 'demo' } });

    // 3. Click Login
    await act(async () => {
        fireEvent.click(loginBtn);
    });

    // 4. Verify Dashboard access
    // We look for the welcome message "Welcome, demo_user" which comes from the mock response
    await waitFor(() => {
        expect(screen.getByText('Welcome, demo_user')).toBeInTheDocument();
        expect(screen.getByText('Live TV')).toBeInTheDocument();
    });
  });
});
