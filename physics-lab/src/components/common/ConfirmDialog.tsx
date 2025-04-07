import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

/**
 * Компонент модального окна подтверждения
 * Используется для отображения важных сообщений и запроса подтверждения действий
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Подтвердить',
    cancelText = 'Отмена'
}) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary">
                    {cancelText}
                </Button>
                <Button onClick={onConfirm} color="primary" autoFocus>
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 