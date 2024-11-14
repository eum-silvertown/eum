import React, {useEffect, useState} from 'react';
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

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission denied');
        return;
      }
    }
    fetchWeather();
  };

  const fetchWeather = () => {
    setLoading(true);
    console.log('날씨 새로고침');
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        await getWeatherData(latitude, longitude);
      },
      error => {
        console.log('Error getting location', error);
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );
  };

  const getWeatherData = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
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
      setLoading(false);
    } catch (error) {
      console.log('Error fetching weather data', error);
    }
  };

  const updateDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', // 요일을 "Monday" 같은 긴 형식으로 표시
      year: 'numeric', // 연도를 숫자로 표시
      month: 'long', // 월을 긴 형식으로 표시 ("January" 같은 형식)
      day: 'numeric', // 날짜를 숫자로 표시
    };
    setDate(now.toLocaleDateString(undefined, options));
  };

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
});
