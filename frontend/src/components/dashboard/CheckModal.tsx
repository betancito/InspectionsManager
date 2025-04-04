import { RootState } from '../../features/store';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeCheckModal, setDescription, setLatitude, setLongitude, setPhoto, completeInspection } from '../../features/slicers/checkSlice';
import { Dialog, DialogContent, DialogTitle, TextField, Button, CircularProgress } from '@mui/material';
import  CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {styled} from '@mui/material/styles';


const CheckModal: React.FC = () => {

    //handlers 
    const dispatch = useDispatch();
    const {open, latitude, longitude, description, photo, completeStatus, error} = useSelector(
        (state: RootState) => state.checkModal
    )
    const handleClose = () => dispatch(closeCheckModal());
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            dispatch(setPhoto(event.target.files[0]));
        };
    }

    const handleSave = () => {
        if (!photo){
            alert("Por favor suba las imagenes pertenencientes a la inspección")
            return
        }
        dispatch(completeInspection());
    };

    //constants
    const MAX_LENGHT = 512;

    //custom styles
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Completar Inspección</DialogTitle>
        <DialogContent>
            <TextField 
                label="Latitud dónde la imagen de la inspección fue tomada"
                type='number'
                value={latitude}
                fullWidth
                margin='normal'
                onChange={(e) => dispatch(setLatitude(Number(e.target.value)))}
            />
            <TextField 
                label="Longitud dónde la imagen de la inspección fue tomada"
                type='number'
                value={longitude}
                fullWidth
                margin='normal'
                onChange={(e) => dispatch(setLongitude(Number(e.target.value)))}
            />
            <TextField
                label="Descipción de la inspección"
                value={description}
                fullWidth
                multiline
                margin='normal'
                rows={3}
                inputProps={{maxLength: MAX_LENGHT}}
                helperText={`${MAX_LENGHT - description.length}/${MAX_LENGHT}`}
                onChange={(e) => dispatch(setDescription((e.target.value)))}
            />
            <div>
                <Button
                component="label"
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                >
                Subir Imagenes de la inspección
                <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileChange}
                    multiple
                />
                </Button>
                {photo&&<p>{photo.name}</p>}
            </div>
            {completeStatus === "loading" && <CircularProgress/>}
            {error && <p className='color-red'>{error}</p>}
            <Button onClick={handleClose} color='secondary'>Cancelar</Button>
            <Button onClick={handleSave} color="success" disabled={completeStatus === "loading"}>Guardar</Button>
        </DialogContent>
    </Dialog>
  )
}

export default CheckModal