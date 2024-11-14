import React, {useEffect, useState, useCallback} from 'react';
import {Text} from '@components/common/Text';
import ContentLayout from './ContentLayout';
import Geolocation from '@react-native-community/geolocation';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Config from 'react-native-config';
import {iconSize} from '@theme/iconSize';
import {colors} from 'src/hooks/useColors';
import axios from 'axios';
import RefreshIcon from '@assets/icons/refreshIcon.svg';

export default function Weather(): React.JSX.Element {
  const API_KEY = Config.OPENWEATHERMAP_API_KEY;
  const [loading, setLoading] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<string | null>(null);
  const [weatherDescription, setWeatherDescription] = useState<string | null>(
    null,
  );
  const [location, setLocation] = useState<string | null>(null);
  const [iconCode, setIconCode] = useState<string | null>(null);
  const [date, setDate] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<{
    title: string;
    description: string;
  } | null>(null); // 오류 메시지 객체로 수정

  const updateDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    setDate(now.toLocaleDateString(undefined, options));
  };

  const getWeatherData = useCallback(
    async (lat: number, lon: number) => {
      try {
        const response = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather',
          {
            params: {
              lat,
              lon,
              lang: 'kr',
              units: 'metric',
              appid: API_KEY,
            },
          },
        );
        const data = response.data;
        setTemperature(`${Math.round(data.main.temp)}°C`);
        setWeatherDescription(data.weather[0].description);
        setLocation(data.name);
        setIconCode(data.weather[0].icon); // 아이콘 코드 설정
        updateDate(); // 날짜 업데이트
        setErrorMessage(null); // 오류 메시지 초기화
        setLoading(false);
      } catch (error) {
        console.log('Error fetching weather data', error);
        setErrorMessage({
          title: '날씨 데이터를 불러오는 데 실패했습니다.',
          description: '다시 시도해 주세요.',
        });
        setLoading(false);
      }
    },
    [API_KEY],
  );

  const fetchWeather = useCallback(() => {
    setLoading(true);
    console.log('날씨 새로고침');
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        await getWeatherData(latitude, longitude);
      },
      error => {
        console.log('Error getting location', error);
        setErrorMessage({
          title: '위치 정보를 가져오는 데 실패했습니다.',
          description: '위치 설정을 확인하세요.',
        });
        setLoading(false); // 에러 발생 시 로딩 종료
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );
  }, [getWeatherData]);

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission denied');
        setErrorMessage({
          title: '위치 권한이 거부되었습니다.',
          description: '날씨 정보를 확인하려면 위치 권한을 허용해 주세요.',
        });
        return;
      }
    }
    fetchWeather();
  }, [fetchWeather]);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  const iconUrl = iconCode
    ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    : null;

  return (
    <ContentLayout flex={1}>
      <View style={styles.header}>
        <Text variant="subtitle" weight="bold">
          날씨
        </Text>
        <TouchableOpacity disabled={loading} onPress={fetchWeather}>
          <RefreshIcon width={iconSize.lg} height={iconSize.lg} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        {loading ? (
          <ActivityIndicator color={colors.light.text.main} size="large" />
        ) : errorMessage ? (
          <View style={styles.errorContainer}>
            <Text color="error">{errorMessage.title}</Text>
            <Text align="center" variant="caption">
              {errorMessage.description}
            </Text>
          </View>
        ) : (
          <>
            {location && <Text>{location}</Text>}
            {date && <Text>{date}</Text>}

            <View style={styles.weatherContainer}>
              {temperature && (
                <Text variant="xxl" weight="bold">
                  {temperature}
                </Text>
              )}

              <View style={styles.weatherBox}>
                {iconUrl && (
                  <Image source={{uri: iconUrl}} style={styles.weatherIcon} />
                )}
                {weatherDescription && <Text>{weatherDescription}</Text>}
              </View>
            </View>
          </>
        )}
      </View>
    </ContentLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 25,
  },
  weatherBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherIcon: {
    width: iconSize.xxl,
    height: iconSize.xxl,
    marginBottom: 5,
  },
  errorContainer: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
});
