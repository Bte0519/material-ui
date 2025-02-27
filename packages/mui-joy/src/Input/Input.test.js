import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  describeConformance,
  describeJoyColorInversion,
  createRenderer,
  screen,
  act,
} from 'test/utils';
import Input, { inputClasses as classes } from '@mui/joy/Input';
import { ThemeProvider } from '@mui/joy/styles';

describe('Joy <Input />', () => {
  const { render } = createRenderer();

  describeConformance(<Input startDecorator="1" endDecorator="2" />, () => ({
    render,
    classes,
    ThemeProvider,
    refInstanceof: window.HTMLDivElement,
    muiName: 'JoyInput',
    testDeepOverrides: { slotName: 'input', slotClassName: classes.input },
    testVariantProps: { variant: 'solid', fullWidth: true },
    testCustomVariant: true,
    slots: {
      root: { expectedClassName: classes.root },
      input: { expectedClassName: classes.input },
      startDecorator: { expectedClassName: classes.startDecorator },
      endDecorator: { expectedClassName: classes.endDecorator },
    },
    skip: ['propsSpread', 'componentsProp', 'classesRoot'],
  }));

  describeJoyColorInversion(<Input />, { muiName: 'JoyInput', classes });

  it('should have error classes', () => {
    const { container } = render(<Input error />);
    expect(container.firstChild).to.have.class(classes.error);
  });

  it('should have fullWidth classes', () => {
    const { container } = render(<Input fullWidth />);
    expect(container.firstChild).to.have.class(classes.fullWidth);
  });

  it('should have startDecorator', () => {
    render(<Input startDecorator={<span data-testid="start">start</span>} />);
    expect(screen.getByTestId('start')).toBeVisible();
  });

  it('should have endDecorator', () => {
    render(<Input endDecorator={<span data-testid="end">end</span>} />);
    expect(screen.getByTestId('end')).toBeVisible();
  });

  describe('prop: required', () => {
    it('should pass to `input` element', () => {
      const { getByRole } = render(<Input required />);
      expect(getByRole('textbox')).to.have.attribute('required');
    });
  });

  describe('prop: disabled', () => {
    it('should have disabled classes', () => {
      const { container, getByRole } = render(<Input disabled />);
      expect(getByRole('textbox')).to.have.attribute('disabled');
      expect(container.firstChild).to.have.class(classes.disabled);
    });

    it('should reset the focused state if getting disabled', () => {
      const handleBlur = spy();
      const handleFocus = spy();
      const { container, setProps } = render(<Input onBlur={handleBlur} onFocus={handleFocus} />);

      act(() => {
        container.querySelector('input').focus();
      });
      expect(handleFocus.callCount).to.equal(1);

      setProps({ disabled: true });
      expect(handleBlur.callCount).to.equal(1);
      // check if focus not initiated again
      expect(handleFocus.callCount).to.equal(1);
    });
  });
});
