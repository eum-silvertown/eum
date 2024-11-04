import React from 'react';
import {Text} from '@components/common/Text';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {spacing} from '@theme/spacing';

import {ScreenType} from '@store/useCurrentScreenStore';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function ClassHeader(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const isLive = true;

  return (
    <View style={styles.header}>
      <Text style={styles.title} variant="title" weight="bold">
        이게 뭐여, 수학이여?
      </Text>
      <View style={styles.rightSection}>
        <View
          style={[styles.chip, isLive ? styles.liveChip : styles.defaultChip]}>
          <Text style={[isLive ? styles.liveChipText : styles.defaultChipText]}>
            LIVE
          </Text>
        </View>
        <TouchableOpacity
          style={styles.enterButton}
          onPress={() => navigation.navigate('LessoningStudentListScreen')}>
          <Text style={styles.enterButtonText}>수업 입장</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  title: {
    flex: 1,
    textAlign: 'left',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: spacing.sm,
  },
  defaultChip: {
    backgroundColor: '#E0E0E0',
  },
  defaultChipText: {
    color: '#333',
  },
  liveChip: {
    backgroundColor: '#FF5252',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  liveChipText: {
    color: '#fff',
  },
  enterButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  enterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ClassHeader;
