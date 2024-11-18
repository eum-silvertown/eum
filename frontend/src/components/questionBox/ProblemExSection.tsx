import React from 'react';
import MathJax from 'react-native-mathjax';
import { StyleSheet, View, Image, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

type ProblemSectionProps = {
  problemText: string;
  fontSize?: number;
  isVisible?: boolean;
};

function ProblemExSection({
  problemText,
  fontSize = 12,
  isVisible = true,
}: ProblemSectionProps): React.JSX.Element {
  const { width } = useWindowDimensions();
  const imageLoadStates = React.useRef<{ [key: string]: boolean }>({}).current;

  const handleImageLoad = React.useCallback((imageUrl: string) => {
    imageLoadStates[imageUrl] = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageError = React.useCallback((imageUrl: string) => {
    imageLoadStates[imageUrl] = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const separateQuestionAndChoices = (text: string): {
    questionParts: Array<{ type: 'text' | 'image', content: string }>,
    choices: string[]
  } => {
    // 개행 문자 처리
    text.replace(/\\n/g, '\n');

    // 선택지 분리
    const lines = text.split('\n');
    const choices = lines.filter(line => /^\s*\([0-9]+\)/.test(line));
    const questionText = lines.filter(line => !/^\s*\([0-9]+\)/.test(line)).join('\n');

    // 텍스트를 이미지와 일반 텍스트로 분리
    const parts: Array<{ type: 'text' | 'image', content: string }> = [];
    let currentText = '';

    questionText.split(/(!\[.*?\]\(.*?\))/).forEach(part => {
      if (part.startsWith('![')) {
        // 이미지 URL 추출
        const match = part.match(/!\[.*?\]\((.*?)\)/);
        if (match && match[1]) {
          if (currentText) {
            parts.push({ type: 'text', content: currentText.trim() });
            currentText = '';
          }
          parts.push({ type: 'image', content: match[1] });
        }
      } else {
        currentText += part;
      }
    });

    if (currentText) {
      parts.push({ type: 'text', content: currentText.trim() });
    }

    return {
      questionParts: parts,
      choices,
    };
  };

  // 숫자를 원문자로 변환하는 함수 추가
  const convertToCircledNumber = (text: string): string => {
    return text.replace(/\(([0-9])\)/g, (match, number) => {
      const circledNumbers = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨'];
      return circledNumbers[parseInt(number, 10) - 1] || match;
    });
  };

  const { questionParts, choices } = separateQuestionAndChoices(problemText);
  const formattedChoices = choices.map(choice => convertToCircledNumber(choice));

  const renderQuestionPart = (part: { type: 'text' | 'image', content: string }, index: number) => {
    if (part.type === 'text') {
      return (
        <MathJax
          key={`text-${index}`}
          html={`<div style="font-size: ${fontSize}px;"><p>${part.content}</p></div>`}
        />
      );
    } else {
      return (
        part.content && <Image
          key={`image-${index}`}
          source={{ uri: part.content }}
          style={styles.image}
          resizeMode="contain"
          onLoad={() => handleImageLoad(part.content)}
          onError={() => handleImageError(part.content)}
        />
      );
    }
  };

  if (!isVisible) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <ScrollView style={{ borderRadius: width * 0.005 }}>
      {questionParts.map((part, index) => renderQuestionPart(part, index))}
      <View>
        <MathJax
          html={`
            <div style="font-size: ${fontSize}px;">
              ${formattedChoices.map(choice => `<p style="margin-left: 20px;">${choice}</p>`).join('')}
            </div>
          `}
        />
      </View>
    </ScrollView>
  );
}

export default ProblemExSection;

const styles = StyleSheet.create({
  image: {
    width: '50%',
    aspectRatio: 1.5,
    alignSelf: 'center',
  },
});
