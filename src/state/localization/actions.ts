import { createAction } from '@reduxjs/toolkit';

export const changeLanguageAction = createAction<'en' | 'ru'>('localization/changeLanguage');
