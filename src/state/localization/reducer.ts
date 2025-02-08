import { createReducer } from '@reduxjs/toolkit';
import { changeLanguageAction } from './actions';

interface InitialState {
  language: 'en' | 'ru';
}

const initialState: InitialState = {
  language: 'en',
};

export default createReducer(initialState, (builder) =>
  builder.addCase(changeLanguageAction, (state, { payload: newLanguage }) => {
    state.language = newLanguage;
  })
);
