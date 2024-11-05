import React from 'react';
import MathJax from 'react-native-mathjax';
import ZoomableView from './ZoomableView';

type ProblemSectionProps = {
  problemText: string;
};

function ProblemSection({ problemText }: ProblemSectionProps): React.JSX.Element {
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
    <div style="padding: 16px;">
      <p>${textWithoutImage}</p>
      ${imageUrl ? `<img src="${imageUrl}" style="width: 30%; margin-top: 10px; display: block; margin: 0 auto" />` : ''}
    </div>
  `;

  return (
    <ZoomableView>
      <MathJax html={mathJaxContent} />
    </ZoomableView>
  );
}

export default ProblemSection;
