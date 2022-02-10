import * as React from "react";
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  padding: 4,
  zIndex: 100,
}

// Will need to add additional props for customization (like buttons)
interface modalProps {
  isOpen: boolean
  handleClose: () => void
  title?: string
  bodyText?: string
}

export default function GenericModal({ isOpen, handleClose, title, bodyText }: modalProps) {

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            {bodyText}
          </Typography>
        </Box> 
      </Modal>
    </div>
  );
}