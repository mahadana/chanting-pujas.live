import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useEffect } from "react";

import ChantEditorJsonButton from "./ChantEditorJsonButton";
import { useChantEditorReducer } from "./ChantEditorReducer";
import ChantEditorMediaPlayer from "./ChantEditorMediaPlayer";
import ChantEditorPlaybackSlider from "./ChantEditorPlaybackSlider";
import ChantEditorTable from "./ChantEditorTable";
import ChantEditorTimingField from "./ChantEditorTimingField";
import {
  exportTiming,
  normalizeTimingWithChant,
  timeToHuman,
} from "../lib/chanting";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "1em 0 5em",
  },
  jsonButton: {
    float: "right",
  },
}));

const loadChant = async (chantId) => {
  const url = `/chants/${chantId}.json`;
  const response = await fetch(url, { cache: "no-cache" });
  return await response.json();
};

const loadTiming = async (chantId) => {
  const url = `/timing/${chantId}.json`;
  const response = await fetch(url, { cache: "no-cache" });
  return await response.json();
};

const saveTiming = async (chantId, timing) => {
  const url = `/timing/${chantId}.json`;
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(timing),
    cache: "no-cache",
    headers: { "Content-Type": "application/json" },
  });
};

const ChantEditor = ({ chantId }) => {
  const [state, dispatch] = useChantEditorReducer();
  const classes = useStyles();

  const { chant, timing } = state;

  useEffect(() => {
    (async () => {
      if (!chant || !timing || chant.id !== chantId || timing.id !== chantId) {
        dispatch({ type: "SET_CHANT_AND_TIMING", chant: null, timing: null });
        const chant = await loadChant(chantId);
        chant.id = chantId;
        let timing = await loadTiming(chantId);
        timing = normalizeTimingWithChant(timing, chant);
        dispatch({ type: "SET_CHANT_AND_TIMING", chant, timing });
      } else {
        await saveTiming(chantId, exportTiming(timing));
      }
    })().catch(console.error);
  }, [chant, chantId, dispatch, timing]);

  if (!chant || !timing) return null;

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.jsonButton}>
            <ChantEditorJsonButton
              dispatch={dispatch}
              state={state}
              variant="outlined"
            >
              JSON
            </ChantEditorJsonButton>
          </div>
          <Typography variant="h4">{`${chant.id} ${chant.title}`}</Typography>
        </Grid>
        <Grid item xs={12}>
          <ChantEditorTimingField
            dispatch={dispatch}
            fieldName="mediaUrl"
            fullWidth
            helperText="Example: https://www.abhayagiri.org/media/chanting/audio/morning.mp3"
            label="Media URL"
            size="small"
            state={state}
            variant="outlined"
            value={timing?.mediaUrl ?? ""}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <ChantEditorTimingField
            dispatch={dispatch}
            fieldName="start"
            fullWidth
            label="Start"
            size="small"
            state={state}
            variant="outlined"
            value={timeToHuman(timing?.start, 1)}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <ChantEditorTimingField
            dispatch={dispatch}
            fieldName="end"
            fullWidth
            label="End"
            size="small"
            state={state}
            variant="outlined"
            value={timeToHuman(timing?.end, 1)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ChantEditorPlaybackSlider dispatch={dispatch} state={state} />
        </Grid>
        <Grid item xs={12}>
          <ChantEditorMediaPlayer dispatch={dispatch} state={state} />
          <ChantEditorTable dispatch={dispatch} state={state} />
        </Grid>
      </Grid>
    </div>
  );
};

export default ChantEditor;
