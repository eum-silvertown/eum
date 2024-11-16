import React, { useState } from 'react';
import MathJax from 'react-native-mathjax';
import { StyleSheet, View, Image } from 'react-native';

type ProblemSectionProps = {
  problemText: string;
};

function ProblemSection({ problemText = '' }: ProblemSectionProps): React.JSX.Element {
  // 이미지 URL 추출 함수
  const extractImageUrl = (text: string): string | null => {
    if (!text) { return null; } // text가 null 또는 undefined인 경우 null 반환
    const imageRegex = /!\[.*?\]\((.*?)\)/;
    const match = text.match(imageRegex);
    return match ? match[1] : null;
  };

  // 텍스트에서 이미지 URL 제거 함수
  const removeImageMarkdown = (text: string): string => {
    if (!text) { return ''; } // text가 null 또는 undefined인 경우 빈 문자열 반환
    return text.replace(/!\[.*?\]\(.*?\)/g, '');
  };

  const imageUrl = extractImageUrl(problemText);
  const textWithoutImage = removeImageMarkdown(problemText);

  const mathJaxContent = `
  <div style="padding-left: 5%; padding-right: 5%; padding-top: 3%;">
    <p style="margin: 1%; font-size:120%;">${textWithoutImage}</p>
  </div>
  `;

  // 이미지 로드 성공 여부를 상태로 관리
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <View style={styles.problemContainer}>
      <MathJax html={mathJaxContent} />
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, imageLoaded ? null : styles.imageLoading]}
          resizeMode="contain"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
        />
      )}
    </View>
  );
}


export default ProblemSection;

const styles = StyleSheet.create({
  problemContainer: {
    width: '100%',
  },
  image: {
    width: '100%',
    aspectRatio: 5,
  },
  imageLoading: {
    display: 'none',
  },
});
