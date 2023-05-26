import React, {useEffect, useState} from "react";
import {animated, useSpring} from "@react-spring/web";
import {
  boldWeight,
  fontBodyCopy,
  fontSize_36,
} from "../../../national-deficit.module.scss";

const CustomBar = ({bar: { x, y, width, height, color,  key, data}}) => {
  const [pauseAnimation, setPauseAnimation ] = useState(true);
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

  let springs  = null;
  if(key.includes("revenue")) {
    springs = useSpring({
      ...props,
      config: {
        ...config,
        duration: data.data["revenue_animation_duration"]
      }
    })
  };

  if(key.includes("deficit")) {
    springs = useSpring({
      ...props,
      config: {
        ...config,
        duration: data.data["deficit_animation_duration"]
      },
      delay: (data.data["revenue_animation_duration"] + 1000)
    })
  }
  
  if(key.includes("spending")) {
    springs = useSpring({
      ...props,
      config: {
        ...config,
        duration: data.data["spending_animation_duration"]
      },
      delay: (data.data["revenue_deficit_animation_duration"] + 1000) // + 2000 instead ?
    })
  }

  // const xPos = data.index ? x + width + 17 : x - 18;
  // const yPos = y + 35;

  const getTextDelay = () => {
    let delay;
    if(key.includes("revenue")) {
      delay = 0;
    } else if(key.includes("deficit")) {
      delay = data.data["revenue_animation_duration"] + 250;
    }
    else {
      delay = data.data["revenue_deficit_animation_duration"] + 250;
    }
    return delay;
  }

  // text style
  // const textStyle = {
  //   fontSize: fontSize_36,
  //   fontWeight: boldWeight,
  //   fill: fontBodyCopy,
  //   textAnchor: data.index ? "start" : "end",
  //   opacity: opacity,
  //   transition: "opacity .25s ease-in"
  // }

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
      setTimeout(() =>
        observer.observe(document.querySelector('[data-testid="deficitComparisonChart"]')), 1000)
    }

  }, [])

    return(
        <>
          {/* <text
            x={xPos}
            y={yPos}
            style={{...textStyle}}
          >
            {`$${data.value.toFixed(2)} T`}
          </text> */}
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
