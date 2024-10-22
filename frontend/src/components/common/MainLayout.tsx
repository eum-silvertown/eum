import {useState} from 'react';
import {RootStackParamList} from '../../../App';
import {StyleSheet, View} from 'react-native';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactElement;
}

function MainLayout({children}: MainLayoutProps): React.JSX.Element {
  const [currentScreen, setCurrentScreen] =
    useState<keyof RootStackParamList>('HomeScreen');

  return (
    <View style={styles.container}>
      <Sidebar
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
      />
      <View>{children}</View>
    </View>
  );
}

export default MainLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});
