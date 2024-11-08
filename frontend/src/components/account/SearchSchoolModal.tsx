import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Text } from '@components/common/Text';
import { spacing } from '@theme/spacing';
import InputField from './InputField';
import CustomDropdownPicker from '@components/common/CustomDropdownPicker'; 
import Config from 'react-native-config';
import { getResponsiveSize } from '@utils/responsive';
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
  const { close } = useModalContext();

  const searchSchool = async () => {
    try {
      const YOUR_API_URL = `https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=${API_KEY}&svcType=api&svcCode=SCHOOL&contentType=json&gubun=${selectdSchoolLevel}&searchSchulNm=${searchQuery}`;
      const response = await fetch(YOUR_API_URL);
      const data = await response.json();
      const schools = data.dataSearch.content.map((school: School) => ({
        id: school.seq,
        name: school.schoolName,
        region: school.region,
      }));
      console.log('학교 검색을 성공하였습니다.');
      console.log(selectdSchoolLevel);
      setSchoolList(schools);
    } catch (error) {
      console.error('학교 검색 중 오류가 발생했습니다.', error);
    }
  };

  const selectSchool = (selectedSchool: string) => {
    onSelectSchool(selectedSchool);
    close();
  };

  return (
    <View>
      <View style={styles.pickerContainer}>
        <CustomDropdownPicker
          items={[
            { label: '중학교', value: 'midd_list' },
            { label: '고등학교', value: 'high_list' },
          ]}
          placeholder="학교 종류 선택"
          onSelectItem={setSelectedSchoolLevel}
          defaultValue={selectdSchoolLevel}
        />
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
        keyExtractor={(item) => item.id.toString()}
        style={{ height: getResponsiveSize(200) }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectSchool(item.name)}>
            <Text>
              {item.name} ({item.region})
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
    marginBottom: spacing.sm,
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
