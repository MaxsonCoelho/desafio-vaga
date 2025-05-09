import React from "react";
import AnsweringQuestionImageIcon from "@commons/assets/unit-icons/answering-question-image.svg";
import AnsweringQuestionTextIcon from "@commons/assets/unit-icons/answering-question-text.svg";
import AudioComprehensionIcon from "@commons/assets/unit-icons/audio-comprehension.svg";
import DialogueIcon from "@commons/assets/unit-icons/dialogue.svg";
import DictationIcon from "@commons/assets/unit-icons/dictation.svg";
import GapFillIcon from "@commons/assets/unit-icons/gap-fill.svg";
import GrammarIcon from "@commons/assets/unit-icons/grammar.svg";
import GrammarCheckIcon from "@commons/assets/unit-icons/grammar-check.svg";
import MultipleCompletePhraseIcon from "@commons/assets/unit-icons/multiple-complete-phrase.svg";
import PresentationIcon from "@commons/assets/unit-icons/presentation.svg";
import PronunciationIcon from "@commons/assets/unit-icons/pronunciation.svg";
import SpeechPracticeIcon from "@commons/assets/unit-icons/speech-practice.svg";
import TrueOrFalseIcon from "@commons/assets/unit-icons/true-or-false.svg";
import UnscramblePhraseDragAndDropIcon from "@commons/assets/unit-icons/unscramble-phrase-drag-and-drop.svg";
import UnscramblePhraseSpeechRecognitionIcon from "@commons/assets/unit-icons/unscramble-phrase-speech-recognition.svg";
import UnscrambleTextIcon from "@commons/assets/unit-icons/unscramble-text.svg";
import VideoComprehensionIcon from "@commons/assets/unit-icons/video-comprehension.svg";
import VocabularyIcon from "@commons/assets/unit-icons/vocabulary.svg";
import VocabularyMeaningsIcon from "@commons/assets/unit-icons/vocabulary-meanings.svg";
import DefaultIcon from "@commons/assets/unit-icons/default.svg";
import { normalizeVerticalSize } from "@utils/sizeUtils";

interface UnitIconProps {
  unitTypeName: string;
  size: number;
}

export default function UnitIcon({ unitTypeName, size }: UnitIconProps) {
  return (
    <>
      {React.createElement(
        {
          AnsweringQuestionText: AnsweringQuestionTextIcon,
          Dictation: DictationIcon,
          GapFill: GapFillIcon,
          Grammar: GrammarIcon,
          MultipleCompletePhrase: MultipleCompletePhraseIcon,
          Presentation: PresentationIcon,
          PresentationVocabulary: PresentationIcon,
          Pronunciation: PronunciationIcon,
          SpeechPractice: SpeechPracticeIcon,
          TrueorFalse: TrueOrFalseIcon,
          UnscramblePhraseDragandDrop: UnscramblePhraseDragAndDropIcon,
          UnscramblePhraseSpeechRecognition: UnscramblePhraseSpeechRecognitionIcon,
          Vocabulary: VocabularyIcon,
          VocabularyMeanings: VocabularyMeaningsIcon,
          GrammarCheck: GrammarCheckIcon,
          Dialogue: DialogueIcon,
          AudioComprehension: AudioComprehensionIcon,
          UnscrambleText: UnscrambleTextIcon,
          AnsweringQuestionImage: AnsweringQuestionImageIcon,
          VideoComprehension: VideoComprehensionIcon,
        }[unitTypeName.replace(/ /g, "")] || DefaultIcon,
        {
          width: normalizeVerticalSize(size),
          height: normalizeVerticalSize(size),
          style: {
            borderRadius: normalizeVerticalSize(size),
            flexShrink: 0,
          },
        },
      )}
    </>
  );
}
