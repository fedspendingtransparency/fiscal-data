
const animationConfig = {
  // mass: 10,
  // friction: 10,
  // tension: 120,
  // clamp: true,
}

const getProps = (height, pauseAnimation) => {
  return {
    from: {
      y: height,
      height: 0,
    },
    to: {
      y: 0,
      height: height
    },
    pause: pauseAnimation
  }
}

export const getSpringConfig = (height, pauseAnimation, data, duration, delay) => {
  console.log(data.data);
  const springProps = getProps(height, pauseAnimation);
  const delayValue = delay ? data.data[delay] + 1000 : 0;
  return {
    ...springProps,
    config: {
      ...animationConfig,
      duration: data.data[duration]
    },
    delay: delayValue
  }
}
