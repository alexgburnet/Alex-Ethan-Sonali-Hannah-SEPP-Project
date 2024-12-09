import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ItemCard from '../../Components/ItemCard/ItemCard';

afterEach(() => {
  cleanup();
});

describe('ItemCard', () => {
  it('renders with default props if none are provided', () => {
    render(
      <MemoryRouter>
        <ItemCard />
      </MemoryRouter>
    );

    // Using getByText ensures there's exactly one match or the test fails
    expect(screen.getByText('Item Name')).toBeTruthy();
    expect(screen.getByText('Item Description')).toBeTruthy();
    expect(screen.getByText('Price: $0.00')).toBeTruthy();
  });

  it('renders with provided props', () => {
    render(
      <MemoryRouter>
        <ItemCard 
          imgSource="https://example.com/item.jpg"
          itemName="Test Item"
          itemDescription="A great item"
          price="10.99"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Item')).toBeTruthy();
    expect(screen.getByText('A great item')).toBeTruthy();
    expect(screen.getByText('Price: $10.99')).toBeTruthy();
  });

  it('renders an image with the provided source', () => {
    render(
      <MemoryRouter>
        <ItemCard imgSource="https://example.com/item.jpg" />
      </MemoryRouter>
    );

    const img = screen.getByRole('img'); // getByRole also ensures a single match
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('https://example.com/item.jpg');
  });

  it('links to the /product route', () => {
    render(
      <MemoryRouter>
        <ItemCard itemName="Linked Item" />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/product');
  });
});