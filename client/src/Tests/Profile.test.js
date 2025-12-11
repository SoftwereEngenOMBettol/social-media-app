import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Profile from '../Components/Profile';
import React from 'react';

describe("Profile", () => {
  it("should render the Profile component", () => {
    render(<Profile />);
    const profileElement = screen.getByText(/Profile/i);
    expect(profileElement).toBeInTheDocument();
  });

  it("should have the text 'Profile'", () => {
    render(<Profile />);
    const text = screen.getByText(/Profile/i);
    expect(text).toBeInTheDocument();
  });

  it("should have an Edit Profile button", () => {
    render(<Profile />);
    const button = screen.getByRole('button', { name: /Edit Profile/i });
    expect(button).toBeInTheDocument();
  });
});