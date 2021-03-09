import _isNil from "lodash/isNil";
import { useReducer } from "react";

import { humanToTime } from "../lib/chanting";

const normalizeTime = (time) => {
  if (!_isNil(time)) {
    time = humanToTime(time);
    if (!_isNil(time)) {
      return parseFloat(time.toFixed(1));
    }
  }
  return null;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CHANT":
      return { ...state, chant: action.chant };
    case "SET_CHANT_AND_TIMING":
      return { ...state, chant: action.chant, timing: action.timing };
    case "SET_MEDIA_PLAYER":
      return { ...state, mediaPlayer: action.mediaPlayer };
    case "SET_PLAYBACK_RATE":
      return { ...state, playbackRate: action.playbackRate };
    case "SET_TIMING":
      return { ...state, timing: action.timing };
    case "SET_TIMING_END": {
      let { timing } = state;
      if (timing) timing = { ...timing, end: normalizeTime(action.end) };
      return { ...state, timing };
    }
    case "SET_TIMING_MEDIA_URL": {
      let { timing } = state;
      if (timing) {
        timing = { ...timing, mediaUrl: action.mediaUrl };
      }
      return { ...state, timing };
    }
    case "SET_TIMING_START": {
      let { timing } = state;
      if (timing) timing = { ...timing, start: normalizeTime(action.start) };
      return { ...state, timing };
    }
    case "UPDATE_NODE": {
      let { timing } = state;
      if (timing) {
        timing = { ...timing };
        const node = timing.nodes[action.index];
        if (node) {
          node.start = normalizeTime(action.start);
          node.end = normalizeTime(action.end);
        }
      }
      return { ...state, timing };
    }
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

const initializer = () => ({
  chant: null,
  exportedTiming: null,
  playbackRate: 1.0,
  timing: null,
});

export const useChantEditorReducer = (props) =>
  useReducer(reducer, props, initializer);
