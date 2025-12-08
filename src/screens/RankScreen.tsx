import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  StatusBar,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'rank'>;

const { width, height } = Dimensions.get('window');
const IS_SMALL = width <= 360;
const VERY_SMALL = height < 650;

const GOLD = '#E6C980';
const GOLD_BORDER = 'rgba(230,201,128,0.62)';

const BTN_W = Math.min(360, width * 0.9);
const BTN_H = VERY_SMALL ? 40 : IS_SMALL ? 44 : 52;
const HEADER_TOP_MARGIN = VERY_SMALL ? 16 : 40;

const IMG_W = IS_SMALL ? width * 0.54 : width * 0.70;
const IMG_H = IS_SMALL ? height * 0.28 : height * 0.34;

const HEADER_TO_IMAGE_GAP = 20; 
const IMAGE_TO_CARD_GAP   = 30; 
const CARD_TO_BUTTON_GAP  = 30; 

const RANK_KEY = 'rank_level';

const RANKS = [
  { title: 'Rookie',    desc: 'A rising talent taking the first steps in sport. Learns from practice, gains confidence, and builds momentum.', img: require('../assets/page.png') },
  { title: 'Knight',  desc: 'A fearless competitor who rises under pressure.Sharp reflexes, bold decisions — ready to strike at the perfect moment.', img: require('../assets/knight.png') },
  { title: 'Baron',   desc: 'A thinker with ambition. Starts connecting facts into patterns of understanding.', img: require('../assets/baron.png') },
  { title: 'Count',   desc: 'Sees beyond simple truth. Strategist of logic and curiosity.', img: require('../assets/count.png') },
  { title: 'Duke',    desc: 'Master of questions, philosopher at heart. Eyes fixed upon the Crown.', img: require('../assets/duke.png') },
  { title: 'Monarch', desc: 'The embodiment of knowledge itself. None stand higher.', img: require('../assets/monarch.png') },
];

async function getRank(): Promise<number> {
  const raw = await AsyncStorage.getItem(RANK_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Math.min(RANKS.length - 1, Math.max(0, isNaN(n) ? 0 : n));
}

const RankScreen: React.FC<Props> = ({ navigation }) => {
  const [rank, setRank] = useState<number>(0);

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(18)).current;

  useEffect(() => { (async () => setRank(await getRank()))(); }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const item = useMemo(() => RANKS[rank], [rank]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={require('../assets/background.png')} style={styles.bg} resizeMode="cover">
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.header,
              { opacity: fade, transform: [{ translateY: rise }], marginTop: HEADER_TOP_MARGIN, marginBottom: 0 },
            ]}
          >
            <View style={styles.line} />
            <Text style={[styles.title, VERY_SMALL && { fontSize: 16 }, IS_SMALL && !VERY_SMALL && { fontSize: 18 }]}>
              MY RANK
            </Text>
            <View style={styles.line} />
          </Animated.View>

          <Animated.View
            style={[
              styles.figureWrap,
              { opacity: fade, transform: [{ translateY: rise }], marginTop: HEADER_TO_IMAGE_GAP },
            ]}
          >
            <Image source={item.img} style={{ width: IMG_W, height: IMG_H, resizeMode: 'contain' }} />
          </Animated.View>

          <Animated.View
            style={[
              styles.descCard,
              {
                opacity: fade,
                transform: [{ translateY: rise }],
                marginTop: IMAGE_TO_CARD_GAP,
                paddingVertical: VERY_SMALL ? 10 : 14,
                marginBottom: 0,
              },
            ]}
          >
            <Text style={[styles.rankTitle, VERY_SMALL && { fontSize: 13 }]}>{item.title}</Text>
            <Text style={[styles.rankDesc, VERY_SMALL && { fontSize: 11, lineHeight: 16 }]}>{item.desc}</Text>
          </Animated.View>

          <Animated.View
            style={{ opacity: fade, transform: [{ translateY: rise }], alignItems: 'center', marginTop: CARD_TO_BUTTON_GAP }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.homeBtn, { width: BTN_W, height: BTN_H }]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={[styles.homeText, VERY_SMALL && { fontSize: 14 }]}>HOME</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default RankScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b0b0f' },
  bg: { flex: 1, width: '100%', height: '100%' },

  container: { flex: 1, paddingHorizontal: 16, justifyContent: 'flex-start' },

  header: { width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 10 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(230,201,128,0.35)' },
  title: { color: GOLD, fontSize: 24, fontWeight: '800', letterSpacing: 2 },

  figureWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },

  descCard: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: GOLD_BORDER,
    backgroundColor: 'rgba(10,8,6,0.70)',
    paddingHorizontal: 16,
  },
  rankTitle: { color: GOLD, fontSize: 16, fontWeight: '900', textAlign: 'center', marginBottom: 6 },
  rankDesc: { color: '#E8E0CF', fontSize: 14, textAlign: 'center', lineHeight: 19 },

  homeBtn: {
    borderRadius: 26,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: GOLD_BORDER,
    shadowColor: '#B88D44',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  homeText: { color: '#17140E', fontSize: 17, fontWeight: '900', textAlign: 'center', width: '100%' },
});
