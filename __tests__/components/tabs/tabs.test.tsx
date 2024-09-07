import Tabs from '@/components/tabs/tabs';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

interface childProps{ 
    value: number
}

const ChildA = ({value}: childProps) => (
  <div>Child A</div>
);

const ChildB = ({value}: childProps) => (
    <div>Child B</div>
);

describe('Tabs Component', () => {
  const headers = ['Comments', 'Activity'];

  test('renders correct number of headers', () => {
    render(
      <Tabs headers={headers}>
        <ChildA value={0} />
        <ChildB value={1} />
      </Tabs>
    );

    const renderedHeaders = screen.getAllByRole('heading');
    expect(renderedHeaders.length).toBe(headers.length);
  });

  test('switches between tabs when headers are clicked', () => {
    render(
      <Tabs headers={headers}>
        <ChildA value={0} />
        <ChildB value={1} />
      </Tabs>
    );

    expect(screen.getByText('Child A')).toBeVisible();

    fireEvent.click(screen.getByText('Activity'));
    expect(screen.getByText('Child B')).toBeVisible();
    expect(screen.queryByText('Child A')).toBeNull();
  });
});
