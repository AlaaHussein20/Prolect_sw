/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Frontend Application Tests', () => {
  test('should pass basic test', () => {
    expect(true).toBe(true);
  });

  test('can render a simple div element', () => {
    const { container } = render(<div>Hello World</div>);
    expect(container.firstChild).toHaveTextContent('Hello World');
  });

  test('can use testing library queries', () => {
    render(<button data-testid="test-button">Click Me</button>);
    const button = screen.getByTestId('test-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click Me');
  });

  test('renders elements with className', () => {
    const { container } = render(<div className="test-class">Content</div>);
    expect(container.querySelector('.test-class')).toBeInTheDocument();
  });
});
