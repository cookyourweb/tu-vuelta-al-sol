import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressedChartPage from '@/app/(dashboard)/progressed-chart/page';

describe('ProgressedChartPage', () => {
  it('renders the page and handles API error for insufficient credit', async () => {
    render(<ProgressedChartPage />);

    // Check for the generate button
    const generateButton = screen.getByRole('button', { name: /Generar Carta Progresada/i });
    expect(generateButton).toBeInTheDocument();

    // Mock fetch to simulate insufficient credit error response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          id: "7376d5f3-4298-4375-8060-488456533bff",
          status: "error",
          errors: [
            {
              title: "Client Error",
              detail: "Your account does not have sufficient credit balance to execute this request."
            }
          ]
        }),
        text: () => Promise.resolve('Your account does not have sufficient credit balance to execute this request.')
      })
    ) as jest.Mock;

    // Click the generate button to trigger API call
    fireEvent.click(generateButton);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/No tienes suficiente crédito para ejecutar esta solicitud./i)).toBeInTheDocument();
    });
  });
});
