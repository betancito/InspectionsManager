import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { Button, CircularProgress, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { setExcelFile, uploadExcelData, clearExcel } from '../../features/slicers/Details/uploadActivitiesSlice';
import { InspectionModel } from '../../utils/types';

interface Props {
  inspection: InspectionModel;
  onComplete?: () => void;
}

const ExcelUpload: React.FC<Props> = ({ inspection, onComplete }) => {
  const dispatch = useDispatch();
  const { fileName, uploadStatus, error } = useSelector((state: RootState) => state.uploadActivities);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    dispatch(setExcelFile(file));
    // reset input so same file can be re‑selected
    e.target.value = '';
  };

  const handleUpload = () => {
    dispatch(uploadExcelData({ inspection }))
      .unwrap()
      .then(() => {
        if (onComplete) onComplete();
        dispatch(clearExcel());
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: "column", alignItems: 'center', gap: 8 }}>
      <input
        id="excel-upload"
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <label htmlFor="excel-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={uploadStatus === 'loading'}
        >
          {fileName || 'Seleccionar Excel'}
        </Button>
      </label>

      <Button
        variant="outlined"
        onClick={handleUpload}
        disabled={uploadStatus === 'loading' || !fileName}
      >
        {uploadStatus === 'loading' ? <CircularProgress size={20} /> : 'Subir JSON'}
      </Button>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
    </div>
  );
};

export default ExcelUpload;
