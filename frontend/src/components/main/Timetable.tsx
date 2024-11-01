import React from 'react';
import { Text } from '@components/common/Text';
import ContentLayout from './ContentLayout'; // ContentLayout 레이아웃 임포트

export default function Timetalbe(): React.JSX.Element {
  return (
    <ContentLayout flex={1}>
      <Text variant='subtitle' weight='bold'>시간표</Text>
      
    </ContentLayout>
  );
}