import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Text } from "@components/common/Text";
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import { spacing } from "@theme/spacing";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenType, useCurrentScreenStore } from '@store/useCurrentScreenStore';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

interface ScreenHeaderProps {
    title: string;
}

function ScreenHeader({title} : ScreenHeaderProps): React.JSX.Element {
    const navigation = useNavigation<NavigationProps>();
    const {setCurrentScreen} = useCurrentScreenStore(); 
    
    return (
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <BackArrowIcon />
        </TouchableOpacity>
        <Text variant="title" style={styles.headerText} weight="bold">
            {title}
        </Text>
    </View>
    )
}

export default ScreenHeader

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: spacing.xl,
        left: spacing.xl,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        marginLeft: spacing.md,
    },
})