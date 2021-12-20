import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState, store } from '../appStore/store';

import axios from 'axios';

import * as _ from 'lodash';

type stemmerType = 'porter' | 'lemmatizer';

export const stemmers: { type: stemmerType; label: string }[] = [
  { type: 'porter', label: 'Porter' },
  { type: 'lemmatizer', label: 'Lemmatizer' }
];

export type vectorizerType = 'TFIDF' | 'Word2Vec';

export const vectorizers: { type: vectorizerType; label: string }[] = [
  { type: 'TFIDF', label: 'TFIDF' },
  { type: 'Word2Vec', label: 'Word To Vector' }
];

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    init: true,
    kMeans: {
      tweets: [],
      config: {
        stemmer: 'porter' as stemmerType,
        vector: 'TFIDF' as vectorizerType
      }
    },
    kMeansUsers: {
      tweets: []
    },
    wordList: {
      words: {} as any,
      config: { ngram: 2 as number, total: 100 as number }
    },
    kMeansAdvanced: {
      tweets: [],
      config: {
        stemmer: 'porter' as stemmerType,
        vector: 'TFIDF' as vectorizerType,
        sentimentAnalysis: false,
        created_at: [new Date().getTime(), new Date().getTime()],
        reTweetCount: 0 as Number,
        userFollowers: 0 as Number,
        sentiments: false
      }
    },
    baseURL: 'http://127.0.0.1:5000',
    searchWords: [] as string[],
    alertWords: [] as string[],
    alertTweets: [] as any[],
    totalPool: 0 as number,
    tweetSize: { new: 0, prevTotal: 0 }
  },
  reducers: {
    setKMeansTweets: (state, action: PayloadAction<any[]>) => {
      state.kMeans.tweets = action.payload;
    },
    setKMeansConfig: (state, action: PayloadAction<any>) => {
      if (action.payload) state.kMeans.config = action.payload;
    },
    setKMeansUsersTweets: (state, action: PayloadAction<any[]>) => {
      state.kMeansUsers.tweets = action.payload;
    },
    setWordList: (state, action: PayloadAction<any>) => {
      state.wordList.words = action.payload;
    },
    setWordListConfig: (state, action: PayloadAction<any>) => {
      if (action.payload) state.wordList.config = action.payload;
    },
    setKMeansAdvancedTweets: (state, action: PayloadAction<any[]>) => {
      state.kMeansAdvanced.tweets = action.payload;
    },
    setKMeansAdvancedConfig: (state, action: PayloadAction<any>) => {
      state.kMeansAdvanced.config = action.payload;
    },
    setSearchWords: (state, action: PayloadAction<string[]>) => {
      state.searchWords = action.payload;
    },
    setAlertWords: (state, action: PayloadAction<string[]>) => {
      state.alertWords = action.payload;
    },
    setAlertTweets: (state, action: PayloadAction<any[]>) => {
      state.alertTweets = action.payload;
    },
    setTotalPool: (state, action: PayloadAction<number>) => {
      state.totalPool = action.payload;
    },
    setTweetSize: (state, action: PayloadAction<any>) => {
      state.tweetSize = action.payload;
    },
    setInit: (state, action: PayloadAction<boolean>) => {
      state.init = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  setKMeansTweets,
  setKMeansConfig,
  setKMeansUsersTweets,
  setWordList,
  setWordListConfig,
  setKMeansAdvancedTweets,
  setKMeansAdvancedConfig,
  setTotalPool,
  setAlertWords,
  setAlertTweets,
  setSearchWords,
  setTweetSize,
  setInit
} = appSlice.actions;

export const getKMeans = (value: number) => async (dispatch: AppDispatch) => {
  const state = store.getState();
  const baseURL = selectBaseURL(state);
  const kMeansConfig = selectKmeansConfig(state);
  const alertWords = selectAlertWords(state);
  const { data } = await axios.post(`${baseURL}/base/kmeans`, {
    groups: value,
    alertWords,
    ...kMeansConfig
  });

  const { tweets } = data;

  dispatch(setKMeansTweets(tweets));
};

export const getKMeansUsers =
  (value: number) => async (dispatch: AppDispatch) => {
    const state = store.getState();
    const baseURL = selectBaseURL(state);
    const { data } = await axios.post(`${baseURL}/base/relevant-users`, {
      groups: value
    });

    const { tweets } = data;

    dispatch(setKMeansUsersTweets(tweets));
  };

export const getWordList = (value: number) => async (dispatch: AppDispatch) => {
  const state = store.getState();
  const baseURL = selectBaseURL(state);
  const wordListConfig = selectWordListConfig(state);
  const kMeansConfig = selectKmeansConfig(state);
  const { data } = await axios.post(`${baseURL}/base/wordlist`, {
    ...wordListConfig,
    ...kMeansConfig,
    groups: value
  });

  const { words } = data;

  dispatch(setWordList(words));
};

export const getKMeansAdvanced =
  (value: number) => async (dispatch: AppDispatch) => {
    const state = store.getState();
    const baseURL = selectBaseURL(state);
    const kMeansConfig = selectKmeansAdvancedConfig(state);
    const dateStart = new Date(kMeansConfig.created_at[0]).toISOString();
    const dateEnd = new Date(kMeansConfig.created_at[1]).toISOString();
    const alertWords = selectAlertWords(state);
    const { data } = await axios.post(`${baseURL}/base/advanced-search`, {
      groups: value,
      alertWords,
      ...kMeansConfig,
      dateStart,
      dateEnd
    });

    const { tweets } = data;

    dispatch(setKMeansAdvancedTweets(tweets));
  };

export const getMoreData = () => async (dispatch: AppDispatch) => {
  const state = store.getState();
  const baseURL = selectBaseURL(state);
  const alertWords = selectAlertWords(state);
  const alertTweet = selectAlertTweets(state);
  const { data } = await axios.post(`${baseURL}/base/createMore`, {
    alertWords
  });
  dispatch(setTweetSize({ new: data.new, prevTotal: data.prevTotal }));
  dispatch(
    setAlertTweets(
      alertTweet.concat(_.map(data.tweets, (tweet) => [tweet, true]))
    )
  );
};

export const recreateData = () => async (dispatch: AppDispatch) => {
  const state = store.getState();
  const baseURL = selectBaseURL(state);
  const searchWords = selectSearchWords(state);
  const totalPool = selectTotalPool(state);
  const { data } = await axios.post(`${baseURL}/base/create`, {
    search: _.join(searchWords, ' OR '),
    total: totalPool
  });

  dispatch(setKMeansTweets([]));
  dispatch(setWordList([]));
  dispatch(setTweetSize({ new: 0, prevTotal: data.total }));
  dispatch(setConfig());
};

export const getConfig = () => async (dispatch: AppDispatch) => {
  const state = store.getState();
  const baseURL = selectBaseURL(state);
  const { data } = await axios.get(`${baseURL}/base/getConfig`);
  if (data.config) {
    const { config } = data;
    dispatch(setSearchWords(config.search.split(' OR ')));
    dispatch(setAlertWords(config.alert.split(' ')));
    dispatch(setTweetSize({ new: 0, prevTotal: config.total }));
    dispatch(setKMeansConfig(config.kMeans));
    dispatch(setWordListConfig(config.wordList));
  }

  dispatch(setInit(false));
};

export const setConfig = () => async (dispatch: AppDispatch) => {
  const state = store.getState();
  const baseURL = selectBaseURL(state);

  const searchWords = selectSearchWords(state);
  const alertWords = selectAlertWords(state);
  const totalPool = selectTotalPool(state);

  await axios.post(`${baseURL}/base/setConfig`, {
    search: _.join(searchWords, ' OR '),
    alert: _.join(alertWords, ' '),
    total: totalPool
  });
};

// Other code such as selectors can use the imported `RootState` type
export const selectKmeansTweets = (state: RootState) => state.app.kMeans.tweets;

export const selectKmeansConfig = (state: RootState) => state.app.kMeans.config;

export const selectKmeansUsersTweets = (state: RootState) =>
  state.app.kMeansUsers.tweets;

export const selectWordList = (state: RootState) => {
  const words = state.app.wordList.words;

  if (_.isEmpty(words)) return words;

  return _.mapValues(words, (words) => {
    let acc = 0;
    const wordList = _.map(words, (word) => [...word, (acc += word[1])]);

    return wordList;
  });
};

export const selectWordListConfig = (state: RootState) =>
  state.app.wordList.config;

export const selectKmeansAdvancedTweets = (state: RootState) =>
  state.app.kMeansAdvanced.tweets;

export const selectKmeansAdvancedConfig = (state: RootState) =>
  state.app.kMeansAdvanced.config;

export const selectBaseURL = (state: RootState) => state.app.baseURL;

export const selectSearchWords = (state: RootState) => state.app.searchWords;

export const selectAlertWords = (state: RootState) => state.app.alertWords;

export const selectAlertTweets = (state: RootState) => state.app.alertTweets;

export const selectTotalPool = (state: RootState) => state.app.totalPool;

export const selectTweetSize = (state: RootState) => state.app.tweetSize;

export const selectInit = (state: RootState) => state.app.init;

export default appSlice.reducer;
