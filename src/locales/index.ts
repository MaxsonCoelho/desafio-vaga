import LocalizedStrings from "react-localization";

import englishLocale from "./english";
import portugueseLocale from "./portuguese";
import spanishLocale from "./spanish";
import get from "lodash/get";
import { mapValues } from "lodash";

const baseLocales = {
  en: englishLocale,
  pt: portugueseLocale,
  es: spanishLocale,
};

const localizedLabels = new LocalizedStrings(baseLocales);

type FormatValues = { [key: string]: string | number };

export const getTranslation = (key: string, values?: FormatValues) =>
  (localizedLabels.formatString(get(localizedLabels, key), values as FormatValues) as string) || key;

export const updateLanguageContent = (content: { [k: string]: object }) => {
  const currentLanguage = localizedLabels.getLanguage();

  localizedLabels.setContent(
    mapValues(baseLocales, (value, key) => ({
      ...value,
      ...(content[key] || {}),
    })),
  );
  localizedLabels.setLanguage(currentLanguage);
};

export default localizedLabels;
