import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Posts from '../Components/Posts';
import React from 'react';

describe("Posts", () => {
  it("should render the Posts component", () => {
    render(<Posts />);
    const postsElement = screen.getByText(/No posts yet/i);
    expect(postsElement).toBeInTheDocument();
  });

  it("should have the text 'No posts yet'", () => {
    render(<Posts />);
    const text = screen.getByText(/No posts yet/i);
    expect(text).toBeInTheDocument();
  });

  it("should have a 'Create Your First Post' button", () => {
    render(<Posts />);
    const button = screen.getByRole('button', { name: /Create Your First Post/i });
    expect(button).toBeInTheDocument();
  });
});