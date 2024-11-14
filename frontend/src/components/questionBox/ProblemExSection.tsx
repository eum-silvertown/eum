import React, {useState} from 'react';
import MathJax from 'react-native-mathjax';
import {StyleSheet, View, Image} from 'react-native';

type ProblemSectionProps = {
  problemText: string;
  fontSize?: number;
};

function ProblemExSection({
  problemText,
  fontSize = 12,
}: ProblemSectionProps): React.JSX.Element {
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
    <div style="font-size: ${fontSize}px; height: 50px;">
      <p>${textWithoutImage}</p>
    </div>
  `;

  // 이미지 로드 성공 여부를 상태로 관리
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <View style={styles.problemContainer}>
      <MathJax html={mathJaxContent} />
      {imageUrl && (
        <Image
          source={{uri: imageUrl}}
          style={[
            styles.image,
            imageLoaded ? styles.imageVisible : styles.imageHidden,
          ]}
          resizeMode="contain"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
        />
      )}
    </View>
  );
}

export default ProblemExSection;

const styles = StyleSheet.create({
  problemContainer: {
    height: '85%',
  },
  image: {
    width: '80%',
    aspectRatio: 1.5, // 이미지 비율을 조정하여 더 자연스럽게 표시
    alignSelf: 'center',
  },
  imageVisible: {
    display: 'flex',
  },
  imageHidden: {
    display: 'none',
  },
});
