import React, {useEffect, useState} from "react";
import {animated, useSpring} from "@react-spring/web";
import {
  boldWeight,
  fontBodyCopy,
  fontSize_36,
} from "../../../national-debt.module.scss";
const CustomBar = ({bar: { x, y, width, height, color,  key, data}}) => {
  const [pauseAnimation, setPauseAnimation] = useState(true);
  const [opacity, setOpacity] = useState(0);

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
    pause: pauseAnimation
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

  const xPos = data.index ? x + width + 17 : x - 18;
  const yPos = y + 35;

  const getTextDelay = () => {
    let delay;
    if(key.includes("Debt Held by the Public")) {
      delay = data.data["holdings_animation_duration"] + data.data["debt_animation_duration"] + 1250;
    } else {
      delay = data.data["holdings_animation_duration"] + 250;
    }
    return delay;
  }

  const textStyle = {
    fontSize: fontSize_36,
    fontWeight: boldWeight,
    fill: fontBodyCopy,
    textAnchor: data.index ? "start" : "end",
    opacity: opacity,
    transition: "opacity .25s ease-in"
  }

  useEffect(() => {
    let observer;
    if(typeof window !== "undefined") {
      const config = {
        rootMargin: '-50% 0% -50% 0%',
        threshold: 0
      }
      observer = new IntersectionObserver(entries => {
        entries.forEach((entry) => {
          if(entry.isIntersecting) {
            setPauseAnimation(false);
            setTimeout(() => {
              setOpacity(1);
            }, [getTextDelay()])
          }
        })
      }, config)
        observer.observe(document.querySelector('[data-testid="breakdownChart"]'));
    }

  }, [])


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
      <text
        x={xPos}
        y={yPos}
        style={{...textStyle}}
      >
        {`$${data.value.toFixed(2)} T`}
      </text>
    </>
  )
};

export default CustomBar;
