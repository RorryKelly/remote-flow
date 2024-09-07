import Switch from "@/components/switch/switch"
import { render } from "@testing-library/react"
import '@testing-library/jest-dom';

interface ChildProps {
    value: string;
  }
  
  const Child: React.FC<ChildProps> = ({ value }) => <div data-testid={`child-${value}`}>{value}</div>;
  
  describe('Switch Component', () => {
    it('should render the correct child based on the test prop', () => {
      const { getByTestId, queryByTestId } = render(
        <Switch test="2">
          <Child value="1" />
          <Child value="2" />
          <Child value="3" />
        </Switch>
      );
  
      expect(getByTestId('child-2')).toBeInTheDocument();
      expect(queryByTestId('child-1')).toBeNull();
      expect(queryByTestId('child-3')).toBeNull();
    });
  
    it('should not render anything if no child matches', () => {
      const { container } = render(
        <Switch test="non-existent">
          <Child value="1" />
          <Child value="2" />
        </Switch>
      );
  
      expect(container.firstChild).toBeNull();
    });
  });