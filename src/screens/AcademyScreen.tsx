import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Share,
  ImageBackground,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'academy'>;

const { width, height } = Dimensions.get('window');
const IS_SMALL = Math.min(width, height) < 700 || width <= 360;
const VERY_SMALL = height < 670;

const GOLD = '#E6C980';
const GOLD_BORDER = 'rgba(230,201,128,0.6)';
const CARD_BG = 'rgba(18,14,10,0.92)';

const BTN_W = Math.min(360, width * 0.9);
const BTN_H = VERY_SMALL ? 44 : IS_SMALL ? 46 : 52;
const PAD_H = 18;

const TOP_SHIFT = 40;     
const EXTRA_GAP = 10;    

type Card = { title: string; text: string };
const CARDS: Card[] = [
  { title: 'The Rosetta Secret', text: 'A single stone taught us to talk to the dead—once we could read their code.' },
  { title: 'Mirror of Genius', text: 'Leonardo was an inventor—his notebooks showed a mind that sketched the future.' },
  { title: 'Desert of Memory', text: 'The Library was once great; after fire—our world learned the cost.' },
  { title: 'The Colors of Logic', text: 'Reason split light to prisms—then pure math saw the framework of truth.' },
  { title: 'The First Ruse', text: 'In ancient circles, secrets decided who won the game, and the city’s trust.' },
  { title: 'The False Helm', text: '“Hide your form to learn”—fake legends grew taller than their authors.' },
  { title: 'The Milky River', text: 'The Greeks drew a road of starlight with milk of a goddess.' },
  { title: 'Threads of Thought', text: 'Pull one—watch your web re-weave and tighten—thoughts go neural.' },
  { title: 'The Child Maestro', text: 'A quiet, strict counsellor to an emperor—yet their short lessons cut deep.' },
  { title: 'The Endless Wall', text: 'Twenty-one towers, a ledger of patience—stone remembers your pace.' },
  { title: 'Riemann’s Design', text: 'He drew soft new spaces—curving thought beneath our feet.' },
  { title: 'The First Academy', text: 'Before Europe’s halls, this was a circle—word was the door.' },
  { title: 'The Wordsmith', text: 'Shakespeare forged new language to smuggle thunder.' },
  { title: 'Athena of Alexandria', text: 'Writer, mind, and teacher—her name walked beyond time.' },
  { title: 'The Twinkling Lie', text: 'Stars don’t twinkle in space; we merely watch our seas of air dance.' },
];

const KEY = 'academy_unlocked';
const MAX = CARDS.length;

export async function incAcademyUnlocked(delta: number) {
  const raw = await AsyncStorage.getItem(KEY);
  const cur = Math.min(MAX, Math.max(0, raw ? parseInt(raw, 10) : 0));
  const next = Math.min(MAX, cur + Math.max(0, delta));
  await AsyncStorage.setItem(KEY, String(next));
}

const AcademyScreen: React.FC<Props> = ({ navigation, route }) => {
  const boost = route?.params?.boost ?? 0;

  const [unlocked, setUnlocked] = useState<number>(3);
  const [i, setI] = useState(0);

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(KEY);
      const initial = raw ? Math.min(MAX, Math.max(1, parseInt(raw, 10))) : 3;
      const withBoost = Math.min(MAX, initial + Math.max(0, boost));
      setUnlocked(withBoost);
      await AsyncStorage.setItem(KEY, String(withBoost));
    })();
  }, [boost]);

  const card = useMemo(() => CARDS[i], [i]);
  const locked = i >= unlocked;

  const prev = () => setI((x) => Math.max(0, x - 1));
  const next = () => setI((x) => Math.min(MAX - 1, x + 1));

  const onShare = async () => {
    try {
      const msg = `Academy of Wisdom — ${card.title}\n${locked ? 'Locked card' : card.text}`;
      await Share.share({ message: msg });
    } catch {}
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={require('../assets/background.png')} resizeMode="cover" style={styles.bg}>
        <View style={{ height: TOP_SHIFT }} />

        <Animated.View style={[styles.headerWrap, { opacity: fade, transform: [{ translateY: rise }] }]}>
          <View style={styles.header}>
            <View style={styles.line} />
            <Text style={styles.title}>ACADEMY</Text>
            <View style={styles.line} />
          </View>
        </Animated.View>

        <View style={{ height: EXTRA_GAP }} />

        <Animated.View style={[styles.body, { opacity: fade, transform: [{ translateY: rise }] }]}>
          <View style={styles.card}>
            <Text style={styles.cardTitle} numberOfLines={1}>{card.title}</Text>

            <View style={styles.cardBox}>
              {locked ? (
                <View style={styles.lockWrap}>
                  <Text style={styles.lockTitle}>Locked</Text>
                  <Text style={styles.lockText}>Win more challenges to unlock this card.</Text>
                </View>
              ) : (
                <Text style={styles.cardText}>{card.text}</Text>
              )}
            </View>

            <View style={{ height: EXTRA_GAP }} />

            <View style={styles.inlineRow}>
              <TouchableOpacity
                onPress={prev}
                activeOpacity={0.9}
                style={[styles.smallBtn, i === 0 && styles.disabled]}
                disabled={i === 0}
              >
                <Text style={styles.smallBtnTxt}>PREVIOUS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={next}
                activeOpacity={0.9}
                style={[styles.smallBtn, i === MAX - 1 && styles.disabled]}
                disabled={i === MAX - 1}
              >
                <Text style={styles.smallBtnTxt}>NEXT</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: (VERY_SMALL ? 12 : 16) + EXTRA_GAP }} />
          <TouchableOpacity activeOpacity={0.9} onPress={onShare} style={styles.bigBtn}>
            <Text style={styles.bigBtnTxt}>SHARE</Text>
          </TouchableOpacity>

          <View style={{ height: (VERY_SMALL ? 8 : 10) + EXTRA_GAP }} />
          <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('Home')} style={styles.bigBtn}>
            <Text style={styles.bigBtnTxt}>HOME</Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AcademyScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b0b0f' },
  bg: { flex: 1 },

  headerWrap: { alignItems: 'center', justifyContent: 'center' },
  header: {
    width: Math.min(380, width * 0.92),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: VERY_SMALL ? 8 : 10,
  },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(230,201,128,0.35)' },
  title: {
    color: GOLD,
    fontSize: VERY_SMALL ? 18 : IS_SMALL ? 22 : 24,
    fontWeight: '800',
    letterSpacing: 2,
  },

  body: { flex: 1, alignItems: 'center', paddingHorizontal: 16, paddingTop: 6 },

  card: {
    width: BTN_W,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: GOLD_BORDER,
    backgroundColor: CARD_BG,
    paddingHorizontal: PAD_H,
    paddingVertical: VERY_SMALL ? 14 : 16,
  },
  cardTitle: {
    alignSelf: 'center',
    color: GOLD,
    fontSize: VERY_SMALL ? 13.5 : IS_SMALL ? 14 : 15.5,
    fontWeight: '900',
    marginBottom: 18, 
  },
  cardBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GOLD_BORDER,
    backgroundColor: 'rgba(10,8,6,0.65)',
    paddingHorizontal: 12,
    paddingVertical: VERY_SMALL ? 12 : 14,
    minHeight: VERY_SMALL ? 84 : 96,
  },
  cardText: {
    color: '#E8E0CF',
    fontSize: VERY_SMALL ? 12 : IS_SMALL ? 12.5 : 13.5,
    textAlign: 'center',
    lineHeight: VERY_SMALL ? 17 : 18,
  },

  lockWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: VERY_SMALL ? 6 : 8 },
  lockTitle: { color: GOLD, fontSize: VERY_SMALL ? 13 : 14, fontWeight: '900', marginBottom: 6, letterSpacing: 0.5 },
  lockText: { color: '#E8E0CF', fontSize: VERY_SMALL ? 12 : IS_SMALL ? 12.5 : 13.5, textAlign: 'center', opacity: 0.9, lineHeight: VERY_SMALL ? 17 : 18 },

  inlineRow: {
    marginTop: (VERY_SMALL ? 10 : 12) + EXTRA_GAP, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  smallBtn: {
    flex: 1,
    height: 34,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: GOLD_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(12,10,7,0.7)',
  },
  smallBtnTxt: { color: GOLD, fontWeight: '900', fontSize: VERY_SMALL ? 12 : 12.5 },

  bigBtn: {
    width: BTN_W,
    height: BTN_H,
    borderRadius: BTN_H / 2,
    borderWidth: 1.2,
    borderColor: GOLD_BORDER,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B88D44',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  bigBtnTxt: { color: '#17140E', fontSize: VERY_SMALL ? 15 : IS_SMALL ? 15.5 : 17, fontWeight: '900', letterSpacing: 0.2 },

  disabled: { opacity: 0.5 },
});
