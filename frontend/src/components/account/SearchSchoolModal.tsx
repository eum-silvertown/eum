import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, FlatList} from 'react-native';
import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import InputField from './InputField';
import CustomDropdownPicker from '@components/common/CustomDropdownPicker';
import Config from 'react-native-config';
import {getResponsiveSize} from '@utils/responsive';
import {useModalContext} from 'src/contexts/useModalContext';

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

export default function SearchSchoolModal({
  onSelectSchool,
}: SearchSchoolModalProps): React.JSX.Element {
  const API_KEY = Config.CAREERNET_API_KEY;
  const [selectedSchoolLevel, setSelectedSchoolLevel] = useState('midd_list');
  const [schoolList, setSchoolList] = useState<SchoolListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const {close} = useModalContext();
  const [loading, setLoading] = useState(false);
  const [isSearchComplete, setIsSearchComplete] = useState(false);

  const searchSchool = async () => {
    setIsSearchComplete(false);
    setLoading(true);
    try {
      const YOUR_API_URL = `https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=${API_KEY}&svcType=api&svcCode=SCHOOL&contentType=json&gubun=${selectedSchoolLevel}&searchSchulNm=${searchQuery}`;
      const response = await fetch(YOUR_API_URL);
      const data = await response.json();
      const schools = data.dataSearch.content.map((school: School) => ({
        id: school.seq,
        name: school.schoolName,
        region: school.region,
      }));

      console.log('학교 검색을 성공하였습니다.');
      console.log(selectedSchoolLevel);
      setSchoolList(schools);
    } catch (error) {
      console.error('학교 검색 중 오류가 발생했습니다.', error);
    } finally {
      setLoading(false);
      setIsSearchComplete(true);
    }
  };

  const selectSchool = (selectedSchool: string) => {
    onSelectSchool(selectedSchool);
    close();
  };

  return (
    <View style={{gap: spacing.md}}>
      <CustomDropdownPicker
        containerStyle={{marginTop: spacing.md}}
        items={[
          {label: '중학교', value: 'midd_list'},
          {label: '고등학교', value: 'high_list'},
        ]}
        onSelectItem={setSelectedSchoolLevel}
        defaultValue={selectedSchoolLevel}
      />

      <InputField
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="학교를 검색해주세요"
        buttonText={loading ? "검색중..." : "검색"}        
        onButtonPress={searchSchool}
        maxLength={50}
      />

      {/* 검색 결과가 없는 경우 표시할 메시지 */}
      {isSearchComplete && schoolList.length === 0 && (
        <Text style={{textAlign: 'center', marginTop: spacing.md}}>
          검색 결과가 없습니다.
        </Text>
      )}
      <FlatList
        data={schoolList}
        keyExtractor={item => item.id.toString()}
        style={{height: getResponsiveSize(200)}}
        renderItem={({item}) => (
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

const styles = StyleSheet.create({});
