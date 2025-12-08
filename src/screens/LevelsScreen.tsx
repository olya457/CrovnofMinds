import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  Image,
  Share,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList, QuizLevelKey } from '../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'levels'>;
type Q = { q: string; a1: string; a2: string; correct: 1 | 2 };

const { width, height } = Dimensions.get('window');
const IS_SMALL = width <= 360;
const VERY_SMALL = height < 650;

const GOLD = '#E6C980';
const GOLD_BORDER = 'rgba(230,201,128,0.6)';
const CARD_BG = 'rgba(18,14,10,0.92)';

const BTN_W = Math.min(360, width * 0.9);
const BTN_H = VERY_SMALL ? 40 : IS_SMALL ? 44 : 52;
const LOGO_W = IS_SMALL ? width * 0.7 : width * 0.88;
const LOGO_H = IS_SMALL ? height * 0.2 : height * 0.26;

const PER_Q_SECONDS = 30;
const PASS_SCORE = 7;
const ACADEMY_KEY = 'academy_unlocked';
const ACADEMY_TOTAL = 15;

async function incAcademyUnlocked(delta = 3) {
  try {
    const raw = await AsyncStorage.getItem(ACADEMY_KEY);
    const cur = raw ? Math.max(0, parseInt(raw, 10)) : 0;
    const next = Math.min(ACADEMY_TOTAL, cur + Math.max(0, delta));
    await AsyncStorage.setItem(ACADEMY_KEY, String(next));
  } catch {}
}

const randCorrect = (): 1 | 2 => (Math.random() < 0.5 ? 1 : 2);

type QMap = Record<QuizLevelKey, Q[]>;
const DATA: QMap = {
  PAGE_KNIGHT: [
    { q: 'Who painted the Mona Lisa?', a1: 'Leonardo da Vinci', a2: 'Michelangelo', correct: randCorrect() },
    { q: 'What planet is known as the Red Planet?', a1: 'Mars', a2: 'Venus', correct: randCorrect() },
    { q: 'Which language has the most native speakers?', a1: 'Mandarin Chinese', a2: 'English', correct: randCorrect() },
    { q: 'The Great Wall of China was built to protect from…', a1: 'Invasions from the north', a2: 'Floods from the east', correct: randCorrect() },
    { q: 'Who wrote “Romeo and Juliet”?', a1: 'William Shakespeare', a2: 'Charles Dickens', correct: randCorrect() },
    { q: 'Plants absorb which gas?', a1: 'Carbon dioxide', a2: 'Oxygen', correct: randCorrect() },
    { q: 'H₂O is…', a1: 'Water', a2: 'Hydrogen', correct: randCorrect() },
    { q: 'Eiffel Tower city?', a1: 'Paris', a2: 'London', correct: randCorrect() },
    { q: 'Shape with three sides?', a1: 'Triangle', a2: 'Rectangle', correct: randCorrect() },
    { q: 'Opposite of “ancient”?', a1: 'Modern', a2: 'Primitive', correct: randCorrect() },
  ],
  KNIGHT_BARON: [
    { q: 'Who proposed the laws of motion and gravity?', a1: 'Isaac Newton', a2: 'Galileo Galilei', correct: randCorrect() },
    { q: 'Element with symbol “O”?', a1: 'Oxygen', a2: 'Gold', correct: randCorrect() },
    { q: 'Water → vapor is…', a1: 'Evaporation', a2: 'Condensation', correct: randCorrect() },
    { q: 'Pyramids of Giza country?', a1: 'Egypt', a2: 'Greece', correct: randCorrect() },
    { q: 'Largest ocean?', a1: 'Pacific Ocean', a2: 'Atlantic Ocean', correct: randCorrect() },
    { q: 'First man on the Moon?', a1: 'Neil Armstrong', a2: 'Buzz Aldrin', correct: randCorrect() },
    { q: 'Capital of Japan?', a1: 'Tokyo', a2: 'Kyoto', correct: randCorrect() },
    { q: 'Fastest land animal?', a1: 'Cheetah', a2: 'Leopard', correct: randCorrect() },
    { q: 'DNA stands for…', a1: 'Deoxyribonucleic Acid', a2: 'Dynamic Neural Algorithm', correct: randCorrect() },
    { q: 'Richter scale measures…', a1: 'Earthquake magnitude', a2: 'Wind speed', correct: randCorrect() },
  ],
  BARON_COUNT: [
    { q: 'Who invented the telephone?', a1: 'Alexander Graham Bell', a2: 'Nikola Tesla', correct: randCorrect() },
    { q: 'Renaissance began in…', a1: 'Italy', a2: 'France', correct: randCorrect() },
    { q: 'Largest planet?', a1: 'Jupiter', a2: 'Saturn', correct: randCorrect() },
    { q: 'Metal mostly used for coins?', a1: 'Copper', a2: 'Iron', correct: randCorrect() },
    { q: 'Who discovered penicillin?', a1: 'Alexander Fleming', a2: 'Marie Curie', correct: randCorrect() },
    { q: 'Organ filtering blood?', a1: 'Kidney', a2: 'Lungs', correct: randCorrect() },
    { q: 'WWII ended in…', a1: '1945', a2: '1939', correct: randCorrect() },
    { q: '“Eureka” is attributed to…', a1: 'Archimedes', a2: 'Aristotle', correct: randCorrect() },
    { q: 'Capital of Canada?', a1: 'Ottawa', a2: 'Toronto', correct: randCorrect() },
    { q: 'Artist who cut off his ear?', a1: 'Vincent van Gogh', a2: 'Pablo Picasso', correct: randCorrect() },
  ],
  COUNT_DUKE: [
    { q: 'Smallest unit of life?', a1: 'Cell', a2: 'Atom', correct: randCorrect() },
    { q: 'Theory of relativity?', a1: 'Albert Einstein', a2: 'Niels Bohr', correct: randCorrect() },
    { q: 'Creator of Sherlock Holmes?', a1: 'Arthur Conan Doyle', a2: 'Agatha Christie', correct: randCorrect() },
    { q: 'Hardest natural substance?', a1: 'Diamond', a2: 'Steel', correct: randCorrect() },
    { q: 'Who painted “The Last Supper”?', a1: 'Leonardo da Vinci', a2: 'Raphael', correct: randCorrect() },
    { q: 'Who gifted Statue of Liberty?', a1: 'France', a2: 'Italy', correct: randCorrect() },
    { q: 'Heliocentric model by…', a1: 'Copernicus', a2: 'Ptolemy', correct: randCorrect() },
    { q: '“Renaissance” means…', a1: 'Rebirth', a2: 'Revolution', correct: randCorrect() },
    { q: 'Capital of Australia?', a1: 'Canberra', a2: 'Sydney', correct: randCorrect() },
    { q: 'Kite electricity experiment?', a1: 'Benjamin Franklin', a2: 'Thomas Edison', correct: randCorrect() },
  ],
  DUKE_MONARCH: [
    { q: 'Library of Alexandria country?', a1: 'Egypt', a2: 'Greece', correct: randCorrect() },
    { q: 'Teacher of Alexander the Great?', a1: 'Aristotle', a2: 'Socrates', correct: randCorrect() },
    { q: 'Chemical symbol for gold?', a1: 'Au', a2: 'Ag', correct: randCorrect() },
    { q: 'Planet with most moons?', a1: 'Jupiter', a2: 'Mars', correct: randCorrect() },
    { q: 'Main language of Brazil?', a1: 'Portuguese', a2: 'Spanish', correct: randCorrect() },
    { q: 'Roman god of war?', a1: 'Mars', a2: 'Jupiter', correct: randCorrect() },
    { q: 'Largest desert on Earth?', a1: 'Antarctica', a2: 'Sahara', correct: randCorrect() },
    { q: 'First printed book?', a1: 'The Gutenberg Bible', a2: 'The Iliad', correct: randCorrect() },
    { q: 'Composer of “The Four Seasons”?', a1: 'Antonio Vivaldi', a2: 'Johann Sebastian Bach', correct: randCorrect() },
    { q: '“Philosophy” literally means…', a1: 'Love of wisdom', a2: 'Path of power', correct: randCorrect() },
  ],
};

const titleByLevel: Record<QuizLevelKey, string> = {
  PAGE_KNIGHT: 'PAGE » KNIGHT',
  KNIGHT_BARON: 'KNIGHT » BARON',
  BARON_COUNT: 'BARON » COUNT',
  COUNT_DUKE: 'COUNT » DUKE',
  DUKE_MONARCH: 'DUKE » MONARCH',
};

const NEXT_LEVEL: Record<QuizLevelKey, QuizLevelKey | null> = {
  PAGE_KNIGHT: 'KNIGHT_BARON',
  KNIGHT_BARON: 'BARON_COUNT',
  BARON_COUNT: 'COUNT_DUKE',
  COUNT_DUKE: 'DUKE_MONARCH',
  DUKE_MONARCH: null,
};

const LevelsScreen: React.FC<Props> = ({ route, navigation }) => {
  const level = route.params.level;
  const questions = useMemo(() => DATA[level], [level]);

  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [lock, setLock] = useState<null | 1 | 2>(null);
  const [over, setOver] = useState<null | 'win' | 'lose'>(null);
  const [sec, setSec] = useState(PER_Q_SECONDS);
  const bar = useRef(new Animated.Value(0)).current;

  const logoFade = useRef(new Animated.Value(0)).current;
  const logoRise = useRef(new Animated.Value(12)).current;
  const androidDrop = useRef(new Animated.Value(Platform.OS === 'android' ? 30 : 0)).current; 

  const cardFade = useRef(new Animated.Value(0)).current;
  const cardRise = useRef(new Animated.Value(16)).current;
  const wroteWinRef = useRef(false);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoFade, { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(logoRise, { toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cardFade, { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(cardRise, { toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    bar.setValue(0);
    Animated.timing(bar, {
      toValue: 1,
      duration: PER_Q_SECONDS * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    setSec(PER_Q_SECONDS);
    const t = setInterval(() => {
      setSec((s) => {
        if (s <= 1) {
          clearInterval(t);
          next(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [i]);

  useEffect(() => {
    if (over === 'win' && !wroteWinRef.current) {
      wroteWinRef.current = true;
      incAcademyUnlocked(3);
    }
  }, [over]);

  const next = (answered: boolean) => {
    setLock(null);
    const last = i >= questions.length - 1;
    if (last) {
      setOver(score + (answered ? 1 : 0) >= PASS_SCORE ? 'win' : 'lose');
    } else {
      setI((x) => x + 1);
      if (answered) setScore((s) => s + 1);
    }
  };

  const pick = (opt: 1 | 2) => {
    if (lock) return;
    setLock(opt);
    const ok = questions[i].correct === opt;
    setTimeout(() => next(ok), 500);
  };

  const progW = bar.interpolate({ inputRange: [0, 1], outputRange: ['100%', '0%'] });
  const restart = () => { setI(0); setScore(0); setLock(null); setOver(null); wroteWinRef.current = false; };

  const goNext = () => {
    const nextKey = NEXT_LEVEL[level];
    if (nextKey) {
      navigation.replace('levels', { level: nextKey });
    } else {
      navigation.navigate('Home');
    }
  };

  const onShare = async () => {
    try {
      await Share.share({ message: `Crown of Minds — ${titleByLevel[level]} • Score ${score}/10` });
    } catch {}
  };

  const q = questions[i];

  if (over) {
    const isWin = over === 'win';
    const bg = isWin
      ? require('../assets/bg_level_done.png')
      : require('../assets/bg_game_over.png');
    const isFinalLevel = NEXT_LEVEL[level] === null;
    const primaryBtnText = isWin
      ? (isFinalLevel ? 'FINISH' : 'NEXT CHALLENGE')
      : 'TRY AGAIN';

    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />
        <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
          <View style={styles.resultBottom}>
            <Text style={[styles.resultTitle, IS_SMALL && { fontSize: 30 }]}>{isWin ? 'RANK ELEVATED' : 'GAME OVER'}</Text>
            <Text style={styles.resultScore}>{`Score ${score}/10`}</Text>
            <Text style={styles.resultSubtitle}>
              {isWin
                ? 'Ascension achieved.'
                : 'Even the wisest fall — but wisdom grows in defeat.'}
            </Text>

            <View style={styles.resultRow}>
              <TouchableOpacity style={styles.sideBtn} activeOpacity={0.9} onPress={onShare}>
                <Image source={require('../assets/share.png')} style={styles.sideIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryBtn}
                activeOpacity={0.9}
                onPress={isWin ? goNext : restart}
              >
                <Text style={[styles.primaryText, IS_SMALL && { fontSize: 15 }]}>{primaryBtnText}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sideBtn}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Home')}
              >
                <Image source={require('../assets/home.png')} style={styles.sideIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={require('../assets/background1.png')} style={styles.bg} resizeMode="cover">
        <Animated.View
          style={[
            styles.logoWrap,
            {
              opacity: logoFade,
              transform: [{ translateY: Animated.add(logoRise, androidDrop) }],
            },
          ]}
        >
          <View style={{ height: VERY_SMALL ? 10 : 30 }} />
          <Image
            source={require('../assets/logo.png')}
            style={[styles.logo, { width: LOGO_W, height: LOGO_H }]}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.body,
            { opacity: cardFade, transform: [{ translateY: cardRise }] },
          ]}
        >
          <View style={[styles.card, { width: BTN_W, paddingVertical: VERY_SMALL ? 12 : 18 }]}>
            <Text style={[styles.qText, VERY_SMALL && { fontSize: 17 }, IS_SMALL && !VERY_SMALL && { fontSize: 19 }]}>{q.q}</Text>

            <View style={styles.progressWrap}>
              <Animated.View style={[styles.progressBar, { width: progW }]} />
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => pick(1)}
              style={[styles.answerBtn, { height: BTN_H }, lock === 1 && (q.correct === 1 ? styles.answerCorrect : styles.answerWrong)]}
            >
              <Text style={[styles.answerText, VERY_SMALL && { fontSize: 14.5 }]}>{q.a1}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => pick(2)}
              style={[styles.answerBtn, { height: BTN_H }, lock === 2 && (q.correct === 2 ? styles.answerCorrect : styles.answerWrong)]}
            >
              <Text style={[styles.answerText, VERY_SMALL && { fontSize: 14.5 }]}>{q.a2}</Text>
            </TouchableOpacity>

            <Text style={[styles.meta, VERY_SMALL && { fontSize: 11 }]}>{`${titleByLevel[level]}   •   Q${i + 1}/10   •   ${sec}s`}</Text>
          </View>
        </Animated.View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default LevelsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  bg: { flex: 1, width: '100%', height: '100%' },
  logoWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 6 },
  logo: { resizeMode: 'contain' },

  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },

  card: {
    borderRadius: 20,
    borderWidth: 1.6,
    borderColor: GOLD_BORDER,
    backgroundColor: CARD_BG,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  qText: { color: GOLD, fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  progressWrap: { width: '100%', height: 10, borderRadius: 6, backgroundColor: 'rgba(230,201,128,0.15)', overflow: 'hidden', marginBottom: 14 },
  progressBar: { height: '100%', backgroundColor: GOLD },
  answerBtn: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1.4,
    borderColor: GOLD_BORDER,
    backgroundColor: 'rgba(12,10,7,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  answerText: { color: GOLD, fontSize: 17, fontWeight: '800' },
  answerCorrect: {
    backgroundColor: 'rgba(30,60,30,0.85)',
    borderColor: GOLD,
    shadowColor: GOLD,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
  },
  answerWrong: { backgroundColor: 'rgba(70,25,25,0.80)' },
  meta: { marginTop: 14, color: 'rgba(232,224,207,0.9)', fontSize: 13, textAlign: 'center' },

  resultBottom: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: VERY_SMALL ? 170 : IS_SMALL ? 220 : 292,
  },
  resultTitle: {
    color: GOLD,
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  resultScore: {
    marginTop: 40,
    color: '#e8e0cf',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '700',
  },
  resultSubtitle: {
    marginTop: 6,
    color: '#e8e0cf',
    fontSize: 16,
    textAlign: 'center',
  },
  resultRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },

  sideBtn: {
    height: BTN_H,
    width: BTN_H * 1.45,
    borderRadius: BTN_H / 2,
    borderWidth: 1.2,
    borderColor: GOLD_BORDER,
    backgroundColor: 'rgba(12,10,7,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideIcon: {
    width: IS_SMALL ? 18 : 20,
    height: IS_SMALL ? 18 : 20,
    tintColor: GOLD,
    resizeMode: 'contain',
  },

  primaryBtn: {
    flex: 1,
    height: BTN_H,
    borderRadius: BTN_H / 2,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B88D44',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryText: {
    color: '#17140E',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.2,
    textAlign: 'center',
    width: '100%',
  },
});
