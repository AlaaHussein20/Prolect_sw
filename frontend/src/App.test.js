import React from 'react';
import { render } from '@testing-library/react';

describe('React Application Tests', () => {
  beforeEach(() => {
    // Mock localStorage
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
  });

  test('React environment is properly configured', () => {
    const TestComponent = () => <div data-testid="test">Hello React</div>;
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('test')).toHaveTextContent('Hello React');
  });

  test('can render components with state', () => {
    const { useState } = React;
    const StatefulComponent = () => {
      const [count] = useState(0);
      return <div data-testid="counter">Count: {count}</div>;
    };
    const { getByTestId } = render(<StatefulComponent />);
    expect(getByTestId('counter')).toHaveTextContent('Count: 0');
  });

  test('rendering components works correctly', () => {
    const { container } = render(<div className="test-app">Test Application</div>);
    expect(container.querySelector('.test-app')).toBeInTheDocument();
  });
});
