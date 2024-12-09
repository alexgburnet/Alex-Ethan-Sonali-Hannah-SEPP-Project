import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Searchbar from '../../Components/Searchbar/Searchbar';

afterEach(() => {
  cleanup();
});

describe('Searchbar', () => {
  it('renders a single input with the placeholder "Search..."', () => {
    render(<Searchbar onSearch={() => {}} />);
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeTruthy();
  });

  it('calls onSearch with the input value when pressing Enter', () => {
    const onSearchMock = vi.fn();
    const { container } = render(<Searchbar onSearch={onSearchMock} />);
    const input = screen.getByPlaceholderText('Search...');
    
    fireEvent.change(input, { target: { value: 'TestValue' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(onSearchMock).toHaveBeenCalledTimes(1);
    expect(onSearchMock).toHaveBeenCalledWith('TestValue');
  });

  it('calls onSearch with the input value when the search button is clicked', () => {
    const onSearchMock = vi.fn();
    const { container } = render(<Searchbar onSearch={onSearchMock} />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'ClickValue' } });

    // The search button container does not have a role or text, so we select by class
    const buttonContainer = container.querySelector('.search-button-container');
    expect(buttonContainer).not.toBeNull();

    fireEvent.click(buttonContainer);
    
    expect(onSearchMock).toHaveBeenCalledTimes(1);
    expect(onSearchMock).toHaveBeenCalledWith('ClickValue');
  });
});