import * as React from 'react';
import classnames from 'classnames';
import { forwardRef } from 'react';
import { Box, BoxProps } from '../box/box';
import { TypeColor } from '../types';

/**
 * A wrapper component for the Input component, provided for
 * custom input implementations but does not need to be used
 * with Input components form this package.
 */
export interface InputWrapperProps extends BoxProps {
  /**
   * Addon that appears before the Input
   */
  addonEnd?: JSX.Element;
  /**
   * Addon that appears after the Input
   */
  addonStart?: JSX.Element;
  /**
   * Sets styling to indicate the input is invalid.
   */
  invalid?: boolean;
  /**
   * Sets the text color when the input is in focus
   *
   * @default 'accent-shade-4'
   */
  textColorActive?: TypeColor;
  /**
   * Sets the text color when the input is hovered
   *
   * @default 'accent-shade-3'
   */
  textColorHover?: TypeColor;
}

export const InputWrapper = forwardRef<any, InputWrapperProps>((props, ref) => {
  const {
    addonEnd,
    addonStart,
    backgroundColor,
    borderRadius = 'x2',
    borderSize = 'x2',
    children,
    disabled,
    gap = 'x3',
    invalid,
    paddingHorizontal = 'x3',
    paddingVertical = 'x2',
    textColorActive = 'accent-shade-4',
    textColorHover = 'accent-shade-3',
    ...rest
  } = props;

  const classes = classnames('Input', {
    'Input--invalid': invalid,
    [`Input--text-color-active-${textColorActive}`]: textColorActive,
    [`Input--text-color-hover-${textColorHover}`]: textColorHover,
  });

  return (
    <Box
      {...rest}
      alignChildrenVertical="middle"
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      borderSize={borderSize}
      className={classes}
      disabled={disabled}
      flex="horizontal"
      gap={gap}
      overflow="hidden"
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
      ref={ref}
    >
      {addonStart && addonStart}
      {children}
      {addonEnd && addonEnd}
    </Box>
  );
});
