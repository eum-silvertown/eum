import React from 'react';
import {Pressable, StyleSheet, useWindowDimensions, View} from 'react-native';
import {Text} from '../common/Text';
import {useQuestionExplorerStore} from '@store/useQuestionExplorerStore';

function BreadCrumb(): React.JSX.Element {
  const {width} = useWindowDimensions();
  const styles = getStyles(width);

  const currentPath = useQuestionExplorerStore(state => state.currentPath);
  const {navigateToHome, navigateToBreadcrumb} = useQuestionExplorerStore();

  return (
    <View style={styles.breadcrumb}>
      <Pressable
        onPress={navigateToHome}
        style={{flexDirection: 'row', gap: width * 0.0025}}>
        <Text style={styles.breadcrumbText}>문제 보관함</Text>
        {currentPath.length > 0 && (
          <Text style={styles.breadcrumbSeparator}>/</Text>
        )}
      </Pressable>

      {currentPath.map((folder, index) => (
        <React.Fragment key={folder.id}>
          <Pressable onPress={() => navigateToBreadcrumb(index, folder)}>
            <Text style={styles.breadcrumbText}>{folder.title}</Text>
          </Pressable>
          {index < currentPath.length - 1 && (
            <Text style={styles.breadcrumbSeparator}>/</Text>
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

export default BreadCrumb;

const getStyles = (width: number) =>
  StyleSheet.create({
    breadcrumb: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: width * 0.0025,
      flexWrap: 'wrap',
    },
    breadcrumbText: {
      color: '#007AFF',
    },
    breadcrumbSeparator: {
      marginHorizontal: width * 0.0025,
      color: '#666',
    },
  });
