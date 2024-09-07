import '@testing-library/jest-dom'; // for the extended matchers
import Tabs from '@/components/tabs/tabs';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Activity from '@/components/activity/activity';

// Sample activities JSON
const sampleActivitiesJson = JSON.stringify([
  { log: '**Activity 1** - This is a test activity with **Markdown** content.' },
  { log: '_Activity 2_ - Another test activity.' },
]);

describe('Activity Component', () => {
  it('should render activities correctly', () => {
    render(<Activity activitiesJson={sampleActivitiesJson} value={0} />);

    // Check that the activities are rendered
    expect(screen.getByText('Activity 1')).toBeInTheDocument();
    expect(screen.getByText('Activity 2')).toBeInTheDocument();
  });

  it('should render Markdown content correctly', () => {
    render(<Activity activitiesJson={sampleActivitiesJson} value={0} />);

    // Check that Markdown content is rendered correctly
    expect(screen.getByText('Activity 1')).toHaveStyle('font-weight: bold');
    expect(screen.getByText('Markdown')).toHaveStyle('font-weight: bold');
    expect(screen.getByText('Activity 2')).toHaveStyle('font-style: italic');
  });

  it('should handle empty activitiesJson', () => {
    render(<Activity activitiesJson={JSON.stringify([])} value={0} />);

    // Check that nothing is rendered if activitiesJson is empty
    expect(screen.queryByText('Activity 1')).toBeNull();
    expect(screen.queryByText('Activity 2')).toBeNull();
  });
});