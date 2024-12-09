import React from 'react';
import { it, expect, describe, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomButton from '../../Components/CustomButton/CustomButton';

describe('CustomButton', () => {

  it('renders default text when no text prop is provided', () => {
    render(<CustomButton />);
    const button = screen.queryByText(/add title attribute/i);
    expect(button).not.toBeNull();
  });

  it('renders the correct text when text prop is provided', () => {
    render(<CustomButton text="Click Me" />);
    const button = screen.queryByText(/click me/i);
    expect(button).not.toBeNull();
  });

  it('calls onClick when button is clicked', () => {
    const handleClick = vi.fn();
    render(<CustomButton text="Click Me Button" onClick={handleClick} />);
    
    const button = screen.queryByText(/click me button/i);
    expect(button).not.toBeNull();
  
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<CustomButton text="Disabled" disabled />);
    const button = screen.queryByText(/disabled/i);
    expect(button).not.toBeNull();
    // Check if the button is actually disabled
    expect(button.disabled).toBe(true);
  });
});