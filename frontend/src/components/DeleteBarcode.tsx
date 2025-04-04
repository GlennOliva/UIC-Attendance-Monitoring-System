import React, { useState } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface DeleteBarcodeProps {
  id: number; // Accept id as a prop
}

const DeleteBarcode: React.FC<DeleteBarcodeProps> = ({ id }) => {
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" | "info" }>({
    open: false,
    message: "",
    severity: "info",
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  async function handleDeleteItem() {
    if (!window.confirm("Are you sure you want to delete this Barcode?")) return;

    try {
      setSnackbar({ open: true, message: "Deleting Barcode...", severity: "info" });

      await axios.delete(`${apiUrl}barcode/${id}`);

      setSnackbar({ open: true, message: "Barcode deleted successfully!", severity: "success" });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting teacher:", error);
      setSnackbar({ open: true, message: "Error deleting teacher!", severity: "error" });
    }
  }

  return (
    <div>
      <button className="delete-btn" onClick={handleDeleteItem}>Delete</button>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DeleteBarcode;
