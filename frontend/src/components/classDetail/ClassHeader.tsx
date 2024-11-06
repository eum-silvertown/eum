import React from 'react';
import {Text} from '@components/common/Text';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {spacing} from '@theme/spacing';
import {ScreenType} from '@store/useCurrentScreenStore';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import VerticalMenuicon from '@assets/icons/verticalMenuIcon.svg';
import {iconSize} from '@theme/iconSize';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

type IsTeacherProps = {
  isTeacher: boolean;
};

function ClassHeader({isTeacher}: IsTeacherProps): React.JSX.Element {
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
        {isTeacher && (
          <TouchableOpacity style={styles.menuIconContainer}>
            <VerticalMenuicon width={iconSize.md} height={iconSize.md} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  title: {
    marginRight: spacing.sm,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  chip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: spacing.xs,
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
    marginRight: spacing.lg,
  },
  enterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  menuIconContainer: {
    marginLeft: spacing.sm,
    marginRight: spacing.xxl,
  },
});

export default ClassHeader;
