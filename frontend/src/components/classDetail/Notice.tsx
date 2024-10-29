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
        공지사항
      </Text>
      <View style={styles.noticeLayout}>
        {/* 첫 번째 포스트잇 */}
        <View style={styles.imageWrapper}>
          <Image source={postit} alt="postit" style={styles.imageContainer} />
          <Text style={styles.overlayText}>공지사항 1</Text>
        </View>

        {/* 두 번째 포스트잇 */}
        <View style={styles.imageWrapper}>
          <Image source={postit} alt="postit" style={styles.imageContainer} />
          <Text style={styles.overlayText}>공지사항 2</Text>
        </View>

        {/* 세 번째 포스트잇 */}
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
  imageWrapper: {
    position: 'relative',
    width: getResponsiveSize(168),
    height: getResponsiveSize(140),
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  overlayText: {
    position: 'absolute',
    marginTop: spacing.xl,
    marginLeft: spacing.lg,
    fontWeight: 'bold',
  },
});

export default Notice;
