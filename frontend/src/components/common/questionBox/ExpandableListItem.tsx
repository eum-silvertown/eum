import {useEffect, useRef, useState} from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  UIManager,
  View,
} from 'react-native';
import ListItemContainer from '../ListItemContainer';
import {Text} from '../Text';
import {spacing} from '@theme/spacing';
import FolderExpandIcon from '@assets/icons/folderExpandIcon.svg';
import FolderIcon from '@assets/icons/folderIcon.svg';
import FileIcon from '@assets/icons/fileIcon.svg';
import VerticalMenuIcon from '@assets/icons/verticalMenuIcon.svg';
import {iconSize} from '@theme/iconSize';

// Android에서 LayoutAnimation 활성화
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type QuestionBoxType = {
  type: 'folder' | 'file';
  parentTitle: string;
  title: string;
  children?: QuestionBoxType[];
};

interface ExpandableListItemProps {
  item: QuestionBoxType;
  level?: number;
}

function ExpandableListItem({
  item,
  level = 0,
}: ExpandableListItemProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const folderExpandIconAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(folderExpandIconAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const hasChildren = item.children && item.children.length > 0;

  return (
    <View style={{paddingLeft: spacing.xl * level}}>
      <Pressable
        onPress={hasChildren ? toggleExpand : undefined}
        style={{marginBottom: spacing.sm}}>
        <ListItemContainer variant="question" style={{gap: spacing.xxl}}>
          {hasChildren && (
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: folderExpandIconAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['180deg', '0deg'],
                    }),
                  },
                ],
              }}>
              <FolderExpandIcon width={iconSize.sm} height={iconSize.sm} />
            </Animated.View>
          )}
          <View>
            {hasChildren ? (
              <FolderIcon width={iconSize.md} height={iconSize.md} />
            ) : (
              <FileIcon width={iconSize.md} height={iconSize.md} />
            )}
          </View>
          <View>
            <Text color="secondary">{item.parentTitle}</Text>
            <Text>{item.title}</Text>
          </View>
          <View style={{marginLeft: 'auto'}}>
            <VerticalMenuIcon width={iconSize.lg} height={iconSize.lg} />
          </View>
        </ListItemContainer>
      </Pressable>

      {isExpanded && hasChildren && (
        <View>
          {item.children?.map((child, index) => (
            <ExpandableListItem
              key={`${child.title}-${index}`}
              item={child}
              level={level + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export default ExpandableListItem;
