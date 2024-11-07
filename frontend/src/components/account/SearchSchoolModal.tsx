import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {Text} from '@components/common/Text';
import React, {useState} from 'react';
import {spacing} from '@theme/spacing';
import InputField from './InputField';
import {Picker} from '@react-native-picker/picker';
import Config from 'react-native-config';
import {getResponsiveSize} from '@utils/responsive';
import { useModalContext } from 'src/contexts/useModalContext';

interface School {
  seq: string;
  schoolName: string;
  region: string;
}

interface SchoolListItem {
  id: string;
  name: string;
  region: string;
}

interface SearchSchoolModalProps {
    onSelectSchool: (schoolName: string) => void;
  }


export default function SearchSchoolModal({ onSelectSchool }: SearchSchoolModalProps): React.JSX.Element {
  const API_KEY = Config.CAREERNET_API_KEY;
  const [selectdSchoolLevel, setSelectedSchoolLevel] = useState('midd_list');
  const [schoolList, setSchoolList] = useState<SchoolListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const {close} = useModalContext();

  // 학교 검색 API 호출
  const searchSchool = async () => {
    try {
      const YOUR_API_URL = `https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=${API_KEY}&svcType=api&svcCode=SCHOOL&contentType=json&gubun=${selectdSchoolLevel}&searchSchulNm=${searchQuery}`;
      const response = await fetch(YOUR_API_URL);
      const data = await response.json();
      const schools = data.dataSearch.content.map((school: School) => ({
        id: school.seq, // 고유 식별자
        name: school.schoolName,
        region: school.region,
      }));
      console.log('학교 검색을 성공하였습니다.');
      console.log(selectdSchoolLevel);
      setSchoolList(schools); // 검색 결과를 상태에 저장하여 FlatList로 표시
    } catch (error) {
      console.error('학교 검색 중 오류가 발생했습니다.', error);
    }
  };

  const selectSchool = (selectedSchool: string) => {
    onSelectSchool(selectedSchool);
    close();
  }

  return (
    <View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectdSchoolLevel}
          onValueChange={itemValue => setSelectedSchoolLevel(itemValue)}
          style={[styles.picker, {borderColor: 'black', borderBottomWidth: 1}]}>
          <Picker.Item key={0} label="중학교" value="midd_list" />
          <Picker.Item key={1} label="고등학교" value="high_list" />
        </Picker>
      </View>

      <InputField
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="학교를 검색해주세요"
        buttonText="검색"
        onButtonPress={searchSchool}
      />

      <FlatList
        data={schoolList}
        keyExtractor={item => item.id.toString()}
        style={{height: getResponsiveSize(200)}}
        renderItem={({item}) => (
          <TouchableOpacity
          onPress={() => selectSchool(item.name)}>
            <Text>
              {item.name}({item.region})
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    borderRadius: 10,
    alignItems: 'center',
  },
  picker: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputFieldWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
    height: 50,
  },
});
