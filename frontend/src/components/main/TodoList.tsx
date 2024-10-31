import React from 'react';
import { Text } from '@components/common/Text';
import ContentLayout from './ContentLayout'; // ContentLayout 레이아웃 임포트

export default function TodoList(): React.JSX.Element {
  return (
    <ContentLayout flex={2}>
      <Text variant='subtitle' weight='bold'>해야할 일</Text>
      
    </ContentLayout>
  );
}
