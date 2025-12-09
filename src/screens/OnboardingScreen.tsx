import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');
const IS_SMALL = width <= 360 || height < 600;
const SCALE = Math.min(1, width / 375);

const GOLD = '#e6c980';
const GOLD_BORDER = 'rgba(230, 201, 128, 0.55)';
const PANEL_BG = 'rgba(12, 10, 7, 0.92)';

type Slide = { key: string; title: string; text: string; button: string; hero: number };

const SLIDES: Slide[] = [
  {
    key: 'path',
    title: 'The Path of Wisdom',
    text:
      'Every kingdom needs a ruler of reason.\n' +
      'Begin your journey from a humble Page and climb\n' +
      'the ranks through knowledge.',
    button: 'CONTINUE',
    hero: require('../assets/ob_path.png'),
  },
  {
    key: 'chess',
    title: 'Challenge the Minds',
    text:
      'Each quiz is a duel of intellect.\n' +
      'Answer wisely, earn your honor, and rise through\n' +
      'the noble ranks.',
    button: 'NEXT',
    hero: require('../assets/ob_chess.png'),
  },
  {
    key: 'academy',
    title: 'Academy of Wisdom',
    text: 'Visit the Academy to sharpen your mind.',
    button: 'NEXT',
    hero: require('../assets/ob_academy.png'),
  },
  {
    key: 'throne',
    title: 'Claim the Crown',
    text:
      'Defeat the Monarch of Minds.\n' +
      'Take the throne and prove that true power lies in wisdom.',
    button: 'BEGIN DUEL',
    hero: require('../assets/ob_throne.png'),
  },
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const goTo = (i: number) => {
    setIndex(i);
    listRef.current?.scrollToIndex({ index: i, animated: true });
  };

  const onNext = () => {
    if (index < SLIDES.length - 1) goTo(index + 1);
    else navigation.replace('Home');
  };

  useEffect(() => {
    listRef.current?.scrollToIndex({ index: 0, animated: false });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground source={require('../assets/background.png')} style={styles.bg}>
        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(it) => it.key}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index: i }) => (
            <SlideItem item={item} isActive={i === index} onNext={onNext} />
          )}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const SlideItem = ({
  item,
  onNext,
  isActive,
}: {
  item: Slide;
  onNext: () => void;
  isActive: boolean;
}) => {
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroY = useRef(new Animated.Value(16)).current;
  const panelOpacity = useRef(new Animated.Value(0)).current;
  const panelY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.timing(heroOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(heroY, { toValue: 0, duration: 420, useNativeDriver: true }),
        Animated.timing(panelOpacity, { toValue: 1, duration: 420, delay: 120, useNativeDriver: true }),
        Animated.timing(panelY, { toValue: 0, duration: 420, delay: 120, useNativeDriver: true }),
      ]).start();
    } else {
      heroOpacity.setValue(0);
      heroY.setValue(16);
      panelOpacity.setValue(0);
      panelY.setValue(24);
    }
  }, [isActive]);

  const SHIFT_UP = IS_SMALL ? 14 : 30;
  const HERO_ZONE = IS_SMALL ? 0.56 : 0.74;

  const baseW = width * (IS_SMALL ? 0.9 : 0.98);
  const baseH = height * (IS_SMALL ? 0.46 : 0.66);

  const addH = IS_SMALL ? 20 : 50;
  const addW = IS_SMALL ? 12 : 28;

  const HERO_W = Math.min(baseW + addW, width);
  const HERO_H = Math.min(baseH + addH, height * 0.9);

  const MIN_PANEL = IS_SMALL ? 150 : 170;
  const BOTTOM_LIFT = IS_SMALL ? 20 : 26;

  return (
    <View style={{ width, height }}>
      <Animated.View
        style={[
          styles.heroWrap,
          {
            height: height * HERO_ZONE,
            opacity: heroOpacity,
            transform: [{ translateY: heroY }],
            marginTop: -SHIFT_UP,
          },
        ]}
      >
        <Image source={item.hero} style={[styles.heroImg, { width: HERO_W, height: HERO_H }]} />
      </Animated.View>

      <Animated.View
        style={[
          styles.panelWrap,
          {
            opacity: panelOpacity,
            transform: [{ translateY: panelY }],
            marginTop: IS_SMALL ? -42 : -54,
            marginBottom: BOTTOM_LIFT,
          },
        ]}
      >
        <View style={[styles.panel, { minHeight: MIN_PANEL }]}>
          <Text
            style={[
              styles.title,
              {
                fontSize: Math.round(20 * SCALE),
                marginBottom: IS_SMALL ? 6 : 8,
              },
            ]}
          >
            {item.title}
          </Text>

          <Text
            style={[
              styles.text,
              {
                fontSize: Math.round((IS_SMALL ? 12 : 14) * SCALE),
                lineHeight: Math.round((IS_SMALL ? 18 : 20) * SCALE),
                marginBottom: IS_SMALL ? 14 : 18,
              },
            ]}
          >
            {item.text}
          </Text>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.btn,
              {
                width: '86%',
                paddingVertical: IS_SMALL ? 10 : 12,
              },
            ]}
            onPress={onNext}
          >
            <Text
              style={[
                styles.btnText,
                {
                  fontSize: Math.max(13, Math.round(15 * SCALE)),
                },
              ]}
            >
              {item.button}
            </Text>
          </TouchableOpacity>

          <View style={{ height: Platform.OS === 'android' ? 8 : 10 }} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0a' },
  bg: { flex: 1 },
  heroWrap: { width: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  heroImg: { resizeMode: 'cover' },
  panelWrap: { paddingHorizontal: IS_SMALL ? 10 : 20 },
  panel: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderWidth: 1.5,
    borderColor: GOLD_BORDER,
    backgroundColor: PANEL_BG,
    paddingHorizontal: IS_SMALL ? 12 : 18,
    paddingTop: IS_SMALL ? 12 : 16,
    paddingBottom: IS_SMALL ? 12 : 16,
    alignItems: 'center',
    alignSelf: 'center',
    width: '92%',
  },
  title: { color: GOLD, fontWeight: '800', textAlign: 'center' },
  text: { color: '#e8e0cf', textAlign: 'center', opacity: 0.92 },
  btn: {
    borderRadius: 16,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GOLD,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  btnText: { color: '#14120b', fontWeight: '800' },
});
