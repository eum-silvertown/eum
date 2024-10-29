import React from 'react';
import {Text} from '@components/common/Text';
import {View, StyleSheet, Image} from 'react-native';
import postit from '@assets/images/postit.png';
import {getResponsiveSize} from '@utils/responsive';
import {spacing} from '@theme/spacing';

function Notice(): React.JSX.Element {
  return (
    <View style={styles.notice}>
      <Text variant="subtitle" weight="bold" style={styles.subtitle}>
        Notice
      </Text>
      <View style={styles.noticeLayout}>
        <Image source={postit} alt="postit" style={styles.imageContainer} />
        <Image source={postit} alt="postit" style={styles.imageContainer} />
        <Image source={postit} alt="postit" style={styles.imageContainer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    marginStart: spacing.xl,
  },
  noticeLayout: {
    flexDirection: 'row',
    gap: spacing.xxl,
    marginHorizontal: 'auto',
  },
  imageContainer: {
    width: getResponsiveSize(168),
    height: getResponsiveSize(140),
  },
});

export default Notice;
