import React from 'react';
import {StyleSheet, View, Animated, Dimensions} from 'react-native';
import Clouds from './background/Clouds';
import Stars from './background/Stars';
import Sky from './background/Sky';
import CelestialObjects from './background/CelestialObjects';

interface BackgroundProps {
  timeProgressAnim: Animated.Value;
  currentTimeAnim: Animated.Value;
  isNightTime: Animated.AnimatedInterpolation<string | number>;
  screenWidth: number;
  startingHour: number;
  endingHour: number;
  transitionHour: number;
}

export default function Background({
  endingHour,
  isNightTime,
  currentTimeAnim,
  screenWidth,
  startingHour,
  timeProgressAnim,
  transitionHour,
}: BackgroundProps): React.JSX.Element {
  const screenHeight = Dimensions.get('window').height;

  return (
    <View style={styles.container}>
      <Sky skyAnim={timeProgressAnim} />

      <Animated.View style={{opacity: isNightTime}}>
        <Stars screenWidth={screenWidth} screenHeight={screenHeight} />
      </Animated.View>

      <Animated.View style={{opacity: Animated.subtract(1, isNightTime)}}>
        <Clouds screenWidth={screenWidth} screenHeight={screenHeight} />
      </Animated.View>

      <CelestialObjects
        startingHour={startingHour}
        endingHour={endingHour}
        transitionHour={transitionHour}
        screenWidth={screenWidth}
        timeAnim={currentTimeAnim}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: -1,
    width: '100%',
    height: '100%',
  },
});
