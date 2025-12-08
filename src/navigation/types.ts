export type QuizLevelKey =
  | 'PAGE_KNIGHT'
  | 'KNIGHT_BARON'
  | 'BARON_COUNT'
  | 'COUNT_DUKE'
  | 'DUKE_MONARCH';

export type RootStackParamList = {
  Loader: undefined;
  Onboarding: undefined;
  Home: undefined;
  levels: { level: QuizLevelKey };
  level1_play: undefined;
  academy: { boost?: number } | undefined;
  rank: { set?: number; inc?: boolean } | undefined;
  profile: undefined;
};

export type ScreenName = keyof RootStackParamList;
