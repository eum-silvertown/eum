import React from 'react';
import {View, StyleSheet, FlatList, useWindowDimensions} from 'react-native';
import {Text} from '@components/common/Text';
import ScheduleIcon from '@assets/icons/scheduleIcon.svg';
type CalendarModalProps = {
  events: {
    id: number;
    lectureId: number;
    backgroundColor: string;
    lectureTitle: string;
    subject: string;
    title: string;
    startTime: string;
    endTime: string;
  }[];
};

const CalendarModal: React.FC<CalendarModalProps> = ({events}) => {
  const {width} = useWindowDimensions();
  const styles = getStyles(width);

  const renderEvent = ({item}: {item: CalendarModalProps['events'][0]}) => (
    <View style={styles.eventItem}>
      <ScheduleIcon />
      <View
        style={[styles.colorBox, {backgroundColor: item.backgroundColor}]}
      />
      <View style={styles.eventDetails}>
        <Text weight="bold">{item.title}</Text>
        <Text>{`${item.subject}`}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.modalContent}>
      {/* 이벤트 리스트 */}
      <FlatList
        data={events}
        renderItem={renderEvent}
        contentContainerStyle={styles.eventList}
      />
    </View>
  );
};

const getStyles = (width: number) =>
  StyleSheet.create({
    modalContent: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: width * 0.02,
    },
    eventList: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      //   width: width * 0.4,
    },
    eventItem: {
      gap: width * 0.01,
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginBottom: width * 0.01,
      padding: width * 0.01,
      borderColor: '#B3B3B3',
      borderBottomWidth: 1,
    },
    colorBox: {
      width: width * 0.01,
      height: width * 0.02,
      borderRadius: width * 0.01,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    eventDetails: {
      width: '100%',
    },
  });

export default CalendarModal;
