import * as React from 'react';
import classNames from 'classnames';
import { forwardRef } from 'react';
import { useFormContext } from '../Form/useFormContext.js';
import { useFormRegisterField } from '../Form/useFormRegisterField.js';
import { Text, TextProps } from '../Text/Text.js';
import { TypeColor } from '../types.js';
import { InputWrapper, InputWrapperProps } from './InputWrapper.js';
import './Input.css';


/**
 * Styled input component with addons and validation
 */
export interface InputProps extends Omit<InputWrapperProps, 'size'>, TextProps {
    placeholderTextColor?: TypeColor;
}

export const Input = forwardRef<
    HTMLInputElement | HTMLTextAreaElement,
    InputProps
  >((props, ref) => {
    const {
      addonEnd,
      addonStart,
      // align,
      backgroundColor = 'background-shade-1',
      borderRadius = 'x2',
      borderSize = 'x2',
      disabled,
      gap = 'x3',
      invalid,
      name,
      onChange,
      paddingHorizontal = 'x3',
      paddingVertical = 'x2',
      placeholder,
      placeholderTextColor = 'text-shade-4',
      // size = 'x3',
      readOnly,
      tag = 'input',
      textColor = 'text-shade-1',
      type,
      value,
      ...rest
    } = props;
    const { getError } = useFormContext();
    const refFormElement = useFormRegisterField(name);

    const inputClassName = classNames('Input__element', {
      [`Input__element--text-color-placeholder-${placeholderTextColor}`]:
        placeholderTextColor,
    });

    return (
        //@ts-ignore
        <InputWrapper
            {...rest}
            style={{ border: 'none' }}
            addonEnd={addonEnd}
            addonStart={addonStart}
            alignChildrenVertical="middle"
            backgroundColor={backgroundColor}
            borderRadius={borderRadius}
            borderSize={borderSize}
            disabled={disabled}
            invalid={invalid || !!(name && getError(name))}
            flex="horizontal"
            gap={gap}
            paddingHorizontal={paddingHorizontal}
            paddingVertical={paddingVertical}
            ref={ref}
        >
            <Text
                // align={align}
                basis="0"
                className={inputClassName}
                disabled={disabled}
                grow
                onChange={onChange}
                placeholder={placeholder}
                name={name}
                readOnly={readOnly}
                ref={refFormElement}
                // size={size}
                tag={tag}
                textColor={textColor}
                type={type}
                value={value}
                weight="x2"
            />
        </InputWrapper>
    );
});
