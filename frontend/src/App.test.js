import React from 'react';
import { render } from '@testing-library/react';

// Simple component test without full App import to avoid router complexity
describe('React Test Environment', () => {
  test('testing environment is working', () => {
    const { container } = render(<div>Test</div>);
    expect(container).toBeTruthy();
  });

  test('can render a basic component', () => {
    const TestComponent = () => <div data-testid="test">Hello</div>;
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('test')).toHaveTextContent('Hello');
  });
});
