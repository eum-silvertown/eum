import React, {useState} from 'react';
import MathJax from 'react-native-mathjax';
import ZoomableView from './ZoomableView';
import {StyleSheet, View, Image} from 'react-native';

type ProblemSectionProps = {
  problemText: string;
};

function ProblemSection({problemText}: ProblemSectionProps): React.JSX.Element {
  // 이미지 URL 추출 함수
  const extractImageUrl = (text: string): string | null => {
    const imageRegex = /!\[.*?\]\((.*?)\)/;
    const match = text.match(imageRegex);
    return match ? match[1] : null;
  };

  // 텍스트에서 이미지 URL 제거 함수
  const removeImageMarkdown = (text: string): string => {
    return text.replace(/!\[.*?\]\(.*?\)/g, '');
  };

  const imageUrl = extractImageUrl(problemText);
  const textWithoutImage = removeImageMarkdown(problemText);

  const mathJaxContent = `
    <div style="padding: 24px;">
      <p>${textWithoutImage}</p>
    </div>
  `;

  // 이미지 로드 성공 여부를 상태로 관리
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <ZoomableView>
      <View style={styles.problemContainer}>
        <MathJax html={mathJaxContent} />
        {imageUrl && (
          <Image
            source={{uri: imageUrl}}
            style={[styles.image, imageLoaded ? null : styles.imageLoading]}
            resizeMode="contain"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
          />
        )}
      </View>
    </ZoomableView>
  );
}

export default ProblemSection;

const styles = StyleSheet.create({
  problemContainer: {
    width: '50%',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 3, // 이미지 비율
    alignSelf: 'center',
  },
  imageLoading: {
    display: 'none', // 이미지 로드 전까지 숨기기
  },
});
