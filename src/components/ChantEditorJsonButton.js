import Button from "@material-ui/core/Button";
import { useState } from "react";

import ChantEditorJsonDialog from "./ChantEditorJsonDialog";
import { exportTiming, normalizeTimingWithChant } from "../lib/chanting";

const ChantEditorJsonButton = ({ children, dispatch, state, ...props }) => {
  const [open, setOpen] = useState(false);

  const onClick = () => setOpen(true);
  const onClose = () => setOpen(false);
  const onUpdate = (timing) => {
    const chant = state.chant;
    if (chant) {
      timing = normalizeTimingWithChant(timing, state.chant);
      dispatch({ type: "SET_TIMING", timing });
    }
  };

  const data = state.timing ? exportTiming(state.timing) : null;

  return (
    <>
      <Button {...props} onClick={onClick}>
        {children}
      </Button>
      <ChantEditorJsonDialog
        data={data}
        onClose={onClose}
        onUpdate={onUpdate}
        open={open}
      />
    </>
  );
};

export default ChantEditorJsonButton;
