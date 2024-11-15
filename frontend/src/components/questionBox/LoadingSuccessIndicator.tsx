import {useEffect} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Check from '@assets/icons/addCircleIcon.svg';
import {iconSize} from '@theme/iconSize';

interface LoadingSuccessIndicatorProps {
  isLoading: boolean;
  isSuccess: boolean;
  onAnimationComplete: () => void;
}

function LoadingSuccessIndicator({
  isLoading,
  isSuccess,
  onAnimationComplete,
}: LoadingSuccessIndicatorProps): React.JSX.Element {
  const {width} = useWindowDimensions();
  const styles = getStyles(width);

  // 로딩 애니메이션을 위한 Animated 값
  const spinValue = new Animated.Value(0);
  // 체크마크 애니메이션을 위한 Animated 값
  const checkScale = new Animated.Value(0);

  // 로딩 스피너 애니메이션
  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 750,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      spinValue.setValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // 성공 체크마크 애니메이션
  useEffect(() => {
    if (isSuccess) {
      Animated.sequence([
        Animated.timing(checkScale, {
          toValue: 1.2,
          duration: 200,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(checkScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 1초 후에 다음 화면으로 전환
        setTimeout(() => {
          onAnimationComplete?.();
        }, 1000);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {isLoading && (
        <Animated.View
          style={[
            styles.loader,
            {
              transform: [{rotate: spin}],
            },
          ]}
        />
      )}
      {isSuccess && (
        <Animated.View
          style={[
            styles.checkContainer,
            {
              transform: [{scale: checkScale}],
            },
          ]}>
          <Check color="#4CAF50" width={iconSize.xl} height={iconSize.xl} />
        </Animated.View>
      )}
    </View>
  );
}

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
    loader: {
      width: width * 0.01,
      height: width * 0.025,
      borderRadius: width * 0.02,
      borderWidth: width * 0.002,
      borderColor: '#e0e0e0',
      borderTopColor: '#2196F3',
    },
    checkContainer: {
      width: width * 0.025,
      height: width * 0.025,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default LoadingSuccessIndicator;
