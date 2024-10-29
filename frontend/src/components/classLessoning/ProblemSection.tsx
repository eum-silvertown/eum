import {ScrollView, StyleSheet} from 'react-native';
import MathJax from 'react-native-mathjax';
import ZoomableView from './ZoomableView';

// 문제 텍스트와 이미지 URL이 포함된 예제
const problemText = `그림과 같이 양수 $t$ 에 대하여 곡선 $y = e^{x} - 1$ 이 두 직선 $y = t$, $y = 5t$ 와 만나는 점을 각각 $\\mathrm{A}$, $\\mathrm{B}$ 라 하고, 점 $B$ 에서 $x$ 축에 내린 수선의 발을 $C$ 라 하자. 삼각형 $ \\mathrm{ACB} $ 의 넓이를 $S(t)$ 라 할 때, $\\lim_{t \\rightarrow 0+} \\frac{S(t)}{t^{2}}$ 의 값을 구하시오.

![문제 그림](https://cdn.mathpix.com/cropped/2024_10_24_e358a6c41606b0dd1525g-1.jpg?height=376&width=299&top_left_y=821&top_left_x=1511)`;

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

function ProblemSection(): React.JSX.Element {
  // 이미지 URL 추출
  const imageUrl = extractImageUrl(problemText);
  const textWithoutImage = removeImageMarkdown(problemText);

  const mathJaxContent = `
    <div style="padding: 16px;">
      <p>${textWithoutImage}</p>
      ${
        imageUrl
          ? `<img src="${imageUrl}" style="height: 100%; margin-top: 10px;" />`
          : ''
      }
    </div>
  `;

  return (
    <ZoomableView>
      <ScrollView style={styles.problemContainer}>
        <MathJax html={mathJaxContent} />
      </ScrollView>
    </ZoomableView>
  );
}

const styles = StyleSheet.create({
  problemContainer: {
    zIndex: 1, // 문제 1층
  },
});

export default ProblemSection;
