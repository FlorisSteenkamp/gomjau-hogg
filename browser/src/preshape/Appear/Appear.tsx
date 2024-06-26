import * as React from 'react';
import { Transition } from 'framer-motion';
import { forwardRef } from 'react';
import { BoxProps } from '../box/box.js';
import { Motion, MotionsProps } from '../Motion/Motion.js';
import { transitionTimeFast } from '../variables.js';
import animations from './animations.js';

export type TypeAnimation =
  | 'Expand'
  | 'Fade'
  | 'FadeSlideUp'
  | 'FadeSlideRight'
  | 'FadeSlideDown'
  | 'FadeSlideLeft'
  | 'Pop'
  | 'ScaleYDown'
  | 'ScaleYUp';

/**
 * Using framer-motion, the Appear component provides a variety of
 * ways to make parts of the UI appear in style.
 */
export interface AppearProps
  extends Omit<BoxProps, 'onDrag' | 'onDragEnd' | 'onDragStart'>,
    Omit<MotionsProps, 'style'> {
  /**
   * Name of the animation to play when the visibility state changes.
   *
   * @default "FadeSlideUp"
   */
  animation?: TypeAnimation;
  /**
   * Time (in milliseconds) that the animation is delayed for.
   *
   * @default 0
   */
  delay?: number;
  /**
   * Duration (in milliseconds) that the animation is played for. Not compatible with
   * spring based animations.
   *
   * @default 200
   */
  duration?: number;
  /** Callback for when the animation has ended */
  onAnimationEnd?: () => void;
  /** Callback for when the animation has started */
  onAnimationStart?: () => void;
  /** The animation origin on the X axis, from 0 -1 */
  originX?: number;
  /** The animation origin on the Y axis, from 0 -1 */
  originY?: number;
  /**
   * Framer Motion transition.
   */
  transition?: Transition;
  /**
   * Trigger for appearance/disappearance animation.
   *
   * @default true
   * */
  visible?: boolean;
  /**
   * The initial visibility state, which determines the starting
   * animation state.
   *
   * @default false
   */
  visibleInitially?: boolean;
}

export const Appear = forwardRef<any, AppearProps>((props, ref) => {
  const {
    animation = 'FadeSlideUp',
    delay = 0,
    duration = transitionTimeFast,
    originX,
    originY,
    visible = true,
    visibleInitially = false,
    ...rest
  } = props;

  const variantsConfig = animations[animation];

  if (!variantsConfig) {
    return null;
  }

  const { transition, variants } = animations[animation](originX, originY);

  return (
    <Motion
      {...rest}
      animate={visible ? 'visible' : 'hidden'}
      initial={visibleInitially ? 'visible' : 'hidden'}
      key={animation}
      ref={ref}
      transition={
        props.transition || {
          ...transition,
          delay: delay / 1000,
          duration: duration / 1000,
        }
      }
      variants={variants}
    />
  );
});
