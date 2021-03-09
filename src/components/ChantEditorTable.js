import Typography from "@material-ui/core/Typography";
import { emphasize, fade, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import _isFinite from "lodash/isFinite";
import { useCallback, useEffect, useState } from "react";

import ChantEditorTimeDialog from "./ChantEditorTimeDialog";
import {
  interpolateTiming,
  normalizeTiming,
  timeToHuman,
} from "../lib/chanting";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: "1rem",
    borderCollapse: "separate",
    borderSpacing: 0,
    fontSize: "1rem",
    "& th": {
      position: "sticky",
      top: "3rem",
      padding: "0.25rem",
      backgroundColor: theme.palette.background.default,
      borderBottom: `1px solid ${theme.palette.text.disabled}`,
      fontWeight: "bold",
    },
  },
  help: {
    margin: "1em 0",
  },
  time: {
    minWidth: "4em",
    textAlign: "center",
    paddingRight: "0.5em",
    font: "400 13.3333px Arial",
  },
  button: {
    backgroundColor: emphasize(theme.palette.background.default, 0.1),
    minWidth: "4.5em",
    color: theme.palette.primary.main,
    border: "none",
    "&:focus": {
      backgroundColor: fade(theme.palette.primary.main, 0.1),
    },
    "&:hover": {
      backgroundColor: fade(theme.palette.primary.main, 0.3),
    },
  },
  active: {
    backgroundColor: fade(theme.palette.primary.main, 0.1),
  },
  verse: {
    fontFamily: "Gentium Incantation",
  },
}));

const focusNextButton = () => {
  const currentButton = document.activeElement;
  const nextButton =
    currentButton?.parentNode?.parentNode?.nextSibling?.children?.[0]
      ?.children?.[0];
  if (nextButton) {
    nextButton.focus();
  }
};

const ChantEditorTable = ({ dispatch, state }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const classes = useStyles();

  const { mediaPlayer, timing } = state;

  useEffect(() => {
    const onKeyDown = (event) => {
      const tagName = String(event.target?.tagName).toLowerCase();
      if (!mediaPlayer || tagName === "input" || tagName === "span") return;
      const key = String(event.key).toLowerCase();
      const currentTime = mediaPlayer.currentTime ?? 0;
      if (key === "p") {
        if (mediaPlayer.paused) {
          mediaPlayer.play();
        } else {
          mediaPlayer.pause();
        }
      } else if (key === "r") {
        mediaPlayer.currentTime = timing?.start ?? 0;
      } else if (key === "arrowleft") {
        mediaPlayer.currentTime = Math.max(currentTime - 2, 0);
      } else if (key === "arrowright") {
        mediaPlayer.currentTime = Math.min(
          currentTime + 2,
          mediaPlayer.duration
        );
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mediaPlayer, timing]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!mediaPlayer) return;
      const currentTime = mediaPlayer.currentTime;
      const newActiveIndex = interpolateTiming(
        normalizeTiming(timing)
      ).nodes.findIndex(
        (time) => time.start <= currentTime && currentTime < time.end
      );
      setActiveIndex(newActiveIndex >= 0 ? newActiveIndex : null);
      if (_isFinite(timing?.end) && timing.end <= currentTime)
        mediaPlayer.pause();
    }, 50);
    return () => {
      clearInterval(interval);
    };
  }, [mediaPlayer, timing]);

  const onCloseEdit = useCallback(() => setEditIndex(null), []);
  const onSavedEdit = focusNextButton;
  const onClickEdit = (event, index) => {
    if (mediaPlayer?.paused === false) {
      const start = mediaPlayer?.currentTime;
      if (_isFinite(start)) {
        dispatch({ type: "UPDATE_NODE", index, start, end: null });
        focusNextButton();
      }
    } else {
      setEditIndex(index);
    }
  };

  return (
    <>
      <Typography className={classes.help} variant="body1">
        Press <strong>P</strong> to <strong>p</strong>lay / <strong>p</strong>
        ause, <strong>R</strong> to <strong>r</strong>ewind, <strong>←</strong>{" "}
        <strong>→</strong> to skip back and forward.
        <br />
        When playing, click the{" "}
        <button autoFocus className={classes.button}>
          -
        </button>{" "}
        button to record the time.
        <br />
        Press <strong>SPACE</strong> or <strong>ENTER</strong> to record the
        time for the following verse.
        <br />
        Press <strong>TAB</strong>, <strong>SHIFT + TAB</strong> to focus the
        previous and following verses.
      </Typography>
      <table className={classes.root}>
        <thead>
          <tr>
            <th className={classes.time}>Start</th>
            <th className={classes.time}>End</th>
            <th>Verse</th>
          </tr>
        </thead>
        <tbody>
          {timing?.nodes?.map?.((node, index) => (
            <tr key={index}>
              <td className={classes.time}>
                <button
                  className={classes.button}
                  onClick={(event) => onClickEdit(event, index)}
                >
                  {timeToHuman(node.start, 1) || "-"}
                </button>
              </td>
              <td className={classes.time}>{timeToHuman(node.end, 1)}</td>
              <td>
                <span
                  className={clsx(
                    classes.verse,
                    index === activeIndex && classes.active
                  )}
                  dangerouslySetInnerHTML={{ __html: node.html }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ChantEditorTimeDialog
        dispatch={dispatch}
        index={editIndex}
        onClose={onCloseEdit}
        onSaved={onSavedEdit}
        state={state}
      />
    </>
  );
};

export default ChantEditorTable;
