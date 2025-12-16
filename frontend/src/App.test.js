import { render, screen } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  render(<App />);
  expect(document.body).toBeInTheDocument();
});

describe('App Component', () => {
  it('should render the application', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});
