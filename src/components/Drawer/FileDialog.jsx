import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const FileDialog = ({ type, open, file, fileName, zoomLevel, handleCloseDialog, handleZoomIn, handleZoomOut }) => {
  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>{fileName}</DialogTitle>
      <DialogContent>
        {type === "image" ? (
          <img
            src={file}
            alt="Preview"
            style={{
              width: `${zoomLevel * 100}%`,
              height: "auto",
              transition: "width 0.3s ease",
            }}
          />
        ) : (
          <embed src={file} width="500px" height="500px" type="application/pdf" />
        )}
      </DialogContent>
      <DialogActions>
        {type === "image" && (
          <>
            <Button onClick={handleZoomIn}>Zoom In</Button>
            {zoomLevel > 1 && <Button onClick={handleZoomOut}>Zoom Out</Button>}
          </>
        )}
        <Button onClick={handleCloseDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileDialog;
