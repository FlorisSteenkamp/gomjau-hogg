import * as React from 'react';
import { forwardRef } from 'react';
import { Box, BoxProps } from '../box/box.js';
import { Text } from '../components/Text/Text.js';

/**
 * The label element of the input. This should be placed
 * directly above the Input component.
 */
export interface InputLabelProps extends Omit<BoxProps, 'label'> {
  /**
   * A helpful description that can be displayed under the input.
   */
  description?: string | JSX.Element;
  /**
   * The label string that is rendered above the Input.
   */
  label?: string | JSX.Element;
}

export const InputLabel = forwardRef<any, InputLabelProps>((props, ref) => {
  const {
    children,
    description,
    label,
    paddingHorizontal = 'x3',
    ...rest
  } = props;

  if (!label && !children && !description) {
    return null;
  }

  return (
    <Box
      {...rest}
      className="InputLabel"
      flex="vertical"
      gap="x2"
      ref={ref}
      tag="label"
    >
      {label && (
        <Text
          ellipsis
          paddingHorizontal={paddingHorizontal}
          size="x3"
          weight="x2"
        >
          {label}
        </Text>
      )}

      {children && (
        <Box flex="vertical" grow>
          {children}
        </Box>
      )}

      {description && (
        <Text
          paddingHorizontal={paddingHorizontal}
          size="x2"
          textColor="text-shade-3"
          weight="x2"
        >
          {description}
        </Text>
      )}
    </Box>
  );
});
