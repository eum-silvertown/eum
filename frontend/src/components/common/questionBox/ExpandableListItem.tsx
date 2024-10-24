import {useState} from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  UIManager,
  View,
} from 'react-native';
import ListItemContainer from '../ListItemContainer';
import {Text} from '../Text';
import {spacing} from '@theme/spacing';

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
        <ListItemContainer variant="question">
          <View>
            <Text color="secondary">{item.parentTitle}</Text>
            <Text>{item.title}</Text>
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
