export interface Toast {
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration: number;
}