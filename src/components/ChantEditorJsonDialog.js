import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useEffect, useRef, useState } from "react";

const ChantEditorJsonDialog = ({ data, onClose, onUpdate, open }) => {
  const textRef = useRef();
  const [json, setJson] = useState("");

  useEffect(() => setJson(JSON.stringify(data, null, 2)), [data]);

  const onClickCopy = () => {
    const el = textRef.current;
    el.focus();
    el.select();
    el.setSelectionRange(0, 99999); // mobile
    document.execCommand("copy");
    onClose?.();
  };

  const onClickUpdate = () => {
    let timing;
    try {
      timing = JSON.parse(json);
    } catch {
      alert("Invalid JSON");
      return;
    }
    onUpdate?.(timing);
    onClose?.();
  };

  const onChange = (event) => {
    setJson(event.target.value);
  };

  return (
    <Dialog
      aria-labelledby="chant-editor-json-dialog"
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
    >
      <DialogTitle id="chant-editor-json-dialog">
        Copy / Update JSON
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="JSON"
          multiline
          onChange={onChange}
          inputRef={textRef}
          rows={20}
          value={json}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={onClickCopy}>
          Copy
        </Button>
        <Button color="secondary" onClick={onClickUpdate}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChantEditorJsonDialog;
