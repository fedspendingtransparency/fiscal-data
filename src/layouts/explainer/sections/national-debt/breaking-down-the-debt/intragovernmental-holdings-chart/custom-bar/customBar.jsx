import React from "react";
import {animated, useSpring} from "@react-spring/web";
const CustomBar = ({bar: { x, y, width, height, color,  key, data}}) => {
  const config = {
    mass: 10,
    friction: 10,
    tension: 120,
    clamp: true,
  }

  const props = {
    from: {
      y: height ,
      height: 0,
    },
    to: {
      y: 0,
      height: height
    },
  }

  const springs_Holdings = useSpring({
    ...props,
    config: {
      ...config,
      duration: data.data["holdings_animation_duration"]
    }
  })

  const springs_Debt = useSpring({
    ...props,
    config: {
      ...config,
      duration: data.data["debt_animation_duration"]
    },
    delay: (data.data["holdings_animation_duration"] + 1000)
  })

  const springs = key.includes("Debt Held by the Public") ? springs_Debt : springs_Holdings;

  return(
    <>
      <animated.rect
        width={width}
        height={height}
        x={x}
        y={y}
        fill={color}
        style={{...springs}}
      />
    </>
  )
};

export default CustomBar;
