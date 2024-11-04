import React from 'react';
import {Text} from '@components/common/Text';
import {View, StyleSheet, Image} from 'react-native';
import postit from '@assets/images/postit.png';
import {spacing} from '@theme/spacing';
import {getResponsiveSize} from '@utils/responsive';

function Notice(): React.JSX.Element {
  return (
    <View style={styles.notice}>
      <Text variant="subtitle" weight="bold" style={styles.subtitle}>
        공지사항
      </Text>
      <View style={styles.noticeLayout}>
        <View style={styles.imageWrapper}>
          <Image source={postit} alt="postit" style={styles.imageContainer} />
          <Text style={styles.overlayText}>공지사항 1</Text>
        </View>

        <View style={styles.imageWrapper}>
          <Image source={postit} alt="postit" style={styles.imageContainer} />
          <Text style={styles.overlayText}>공지사항 2</Text>
        </View>

        <View style={styles.imageWrapper}>
          <Image source={postit} alt="postit" style={styles.imageContainer} />
          <Text style={styles.overlayText}>공지사항 3</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    height: '50%',
    justifyContent: 'center',
    paddingVertical: getResponsiveSize(10),
  },
  subtitle: {
    marginTop: spacing.lg,
    marginStart: spacing.xl,
  },
  noticeLayout: {
    flexDirection: 'row',
    gap: spacing.xxl,
    paddingHorizontal: getResponsiveSize(20),
  },
  imageWrapper: {
    position: 'relative',
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  },
  overlayText: {
    position: 'absolute',
    marginTop: spacing.xl,
    marginLeft: spacing.lg,
    fontWeight: 'bold',
  },
});

export default Notice;
