import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Text} from '../common/Text';
import {useQuestionExplorerStore} from '@store/useQuestionExplorerStore';

function BreadCrumb(): React.JSX.Element {
  const currentPath = useQuestionExplorerStore(state => state.currentPath);
  const {navigateToHome, navigateToBreadcrumb} = useQuestionExplorerStore();

  return (
    <View style={styles.breadcrumb}>
      <Pressable
        onPress={navigateToHome}
        style={{flexDirection: 'row', gap: 10}}>
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

const styles = StyleSheet.create({
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  breadcrumbText: {
    color: '#007AFF',
  },
  breadcrumbSeparator: {
    marginHorizontal: 5,
    color: '#666',
  },
});
