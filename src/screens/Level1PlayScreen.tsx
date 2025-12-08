import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, QuizLevelKey } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'level1_play'>;

const { width, height } = Dimensions.get('window');
const IS_SMALL = Math.min(width, height) < 700 || width <= 360;
const VERY_SMALL = height < 670; 
const GOLD = '#E6C980';
const GOLD_BORDER = 'rgba(230,201,128,0.62)';
const BTN_W = Math.min(360, width * (IS_SMALL ? 0.9 : 0.86));
const BTN_H = VERY_SMALL ? 44 : IS_SMALL ? 46 : 52;
const EXTRA_TOP_SHIFT = 20;  
const EXTRA_HEADER_GAP = 20;  

const ROWS: Array<{ title: string; key: QuizLevelKey }> = [
  { title: 'Page » Knight',   key: 'PAGE_KNIGHT' },
  { title: 'Knight » Baron',  key: 'KNIGHT_BARON' },
  { title: 'Baron » Count',   key: 'BARON_COUNT' },
  { title: 'Count » Duke',    key: 'COUNT_DUKE' },
  { title: 'Duke » Monarch',  key: 'DUKE_MONARCH' },
];

const Level1PlayScreen: React.FC<Props> = ({ navigation }) => {
  const [selected, setSelected] = useState<number | null>(0);

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(22)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 480, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 480, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const goLevel = (idx: number) => {
    setSelected(idx);
    const key = ROWS[idx].key;
    setTimeout(() => navigation.navigate('levels', { level: key }), 160);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={require('../assets/background.png')} resizeMode="cover" style={styles.bg}>
        <Animated.View style={[styles.inner, { opacity: fade, transform: [{ translateY: rise }] }]}>
          <View style={{ height: 40 + EXTRA_TOP_SHIFT }} />

          <View style={styles.header}>
            <View style={styles.line} />
            <Text style={styles.title}>QUIZZES</Text>
            <View style={styles.line} />
          </View>
          <View style={{ height: EXTRA_HEADER_GAP }} />
          <View style={styles.list}>
            {ROWS.map((row, i) => {
              const active = selected === i;
              return (
                <TouchableOpacity
                  key={row.key}
                  activeOpacity={0.9}
                  style={[styles.row, active && styles.rowActive]}
                  onPress={() => goLevel(i)}
                >
                  <Text style={[styles.rowText, active && styles.rowTextActive]}>{row.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.homeBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.homeText}>HOME</Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Level1PlayScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0a' },
  bg: { flex: 1 },

  inner: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: VERY_SMALL ? 4 : 10,
  },

  header: {
    width: Math.min(380, width * 0.92),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: VERY_SMALL ? 8 : 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(230,201,128,0.35)',
  },
  title: {
    color: GOLD,
    fontSize: VERY_SMALL ? 18 : IS_SMALL ? 22 : 24,
    fontWeight: '800',
    letterSpacing: 2,
  },

  list: { width: BTN_W, gap: VERY_SMALL ? 10 : 14 },

  row: {
    height: BTN_H,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: GOLD_BORDER,
    backgroundColor: 'rgba(12,10,7,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  rowActive: {
    backgroundColor: 'rgba(30, 38, 26, 0.78)',
    borderColor: GOLD,
    shadowColor: GOLD,
    shadowOpacity: 0.20,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  rowText: {
    color: GOLD,
    fontSize: VERY_SMALL ? 14 : IS_SMALL ? 15 : 16,
    fontWeight: '800',
  },
  rowTextActive: { color: '#FFE8AB' },

  homeBtn: {
    marginTop: VERY_SMALL ? 16 : IS_SMALL ? 20 : 26,
    width: BTN_W * 0.8,
    height: BTN_H,
    borderRadius: 12,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B88D44',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  homeText: {
    color: '#17140E',
    fontSize: VERY_SMALL ? 13 : IS_SMALL ? 14 : 15,
    fontWeight: '800',
  },
});
