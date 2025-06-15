export interface ToastMessage<T extends ToastColor> {
    type: T;
    message: string;
}

export enum ToastColor {
    success = 'success',
    error = 'error',
    warning = 'warning',
    info = 'info'
}