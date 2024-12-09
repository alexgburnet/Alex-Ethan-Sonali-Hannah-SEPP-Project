import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import AddressForm from '../../Components/AddressForm/AddressForm';

afterEach(cleanup);

describe('AddressForm', () => {
  const initialAddress = {
    address: '123 Main St',
    city: 'Anytown',
    postalCode: '12345',
    country: 'USA'
  };

  it('updates address on change', () => {
    const setAddressInfo = vi.fn();
    render(<AddressForm AddressInfo={initialAddress} setAddressInfo={setAddressInfo} />);

    const addressInput = screen.getByLabelText('Address:');
    fireEvent.change(addressInput, { target: { name: 'address', value: '456 Elm St' }});

    // setAddressInfo should have been called once with a function
    expect(setAddressInfo).toHaveBeenCalledTimes(1);
    const updateFunction = setAddressInfo.mock.calls[0][0];

    // Simulate what React would do: call that function with the old state
    const newState = updateFunction(initialAddress);
    expect(newState).toEqual({
      ...initialAddress,
      address: '456 Elm St'
    });
  });
});