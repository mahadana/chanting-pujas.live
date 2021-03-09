import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import _isFinite from "lodash/isFinite";
import _isNil from "lodash/isNil";
import { memo, useEffect, useRef } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    padding: "0.25rem 0",
    backgroundColor: theme.palette.background.default,
  },
  audio: {
    height: "2.5rem",
    width: "calc(100% - 5rem)",
  },
}));

const ChantEditorMediaPlayer = memo(
  ({ dispatch, state }) => {
    const ref = useRef();
    const classes = useStyles();

    const { playbackRate, timing } = state;
    const mediaUrl = timing?.mediaUrl;

    useEffect(() => {
      const mediaPlayer = ref.current;
      if (state.mediaPlayer !== mediaPlayer) {
        dispatch({ type: "SET_MEDIA_PLAYER", mediaPlayer });
      }
      const metaHandler = () => {
        const duration = mediaPlayer?.duration;
        if (_isNil(timing.end) && _isFinite(duration)) {
          dispatch({ type: "SET_TIMING_END", end: duration });
        }
      };
      mediaPlayer?.addEventListener?.("loadedmetadata", metaHandler);
      return () =>
        mediaPlayer?.removeEventListener?.("loadedmetadata", metaHandler);
    }, [timing]);

    useEffect(() => {
      const mediaPlayer = ref.current;
      if (mediaPlayer) mediaPlayer.src = mediaUrl;
    }, [mediaUrl]);

    useEffect(() => {
      const mediaPlayer = ref.current;
      if (mediaPlayer) mediaPlayer.playbackRate = playbackRate;
    }, [playbackRate]);

    const onClick = () => {
      const mediaPlayer = ref.current;
      if (mediaPlayer) {
        mediaPlayer.currentTime = timing?.start ?? 0;
        mediaPlayer.play();
      }
    };

    return (
      <div className={classes.root}>
        <Button onClick={onClick} variant="outlined">
          ↺
        </Button>
        <audio autoPlay={false} className={classes.audio} controls ref={ref} />
      </div>
    );
  },
  (prev, next) =>
    prev.dispatch === next.dispatch &&
    prev.state.playbackRate === next.state.playbackRate &&
    prev.state.timing === next.state.timing
);

ChantEditorMediaPlayer.displayName = "ChantEditorMediaPlayer";

export default ChantEditorMediaPlayer;
