import '@testing-library/jest-dom';  // Import jest-dom for custom matchers
import { describe, it, expect } from 'vitest';  // Import expect from Vitest
import { render, screen } from '@testing-library/react';  // Import rendering utilities
import About from '../Components/About';
import React from 'react';


describe("About", () => {

  it("should render the About component", () => {
  
    render(<About />);
     
    const aboutElement = screen.getByRole('heading', {level: 1})
    expect(aboutElement).toBeInTheDocument();
  });

 it("should have the text about", () => {
    render(<About />);
    // Search for text containing "about" (case-insensitive).
    // /about/i → regex that matches: about, About, ABOUT, etc.
    const text = screen.queryByText(/about/i); 
    expect(text).toBeInTheDocument();
  });  



});