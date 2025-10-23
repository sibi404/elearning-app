export const showNetworkError = (toast) => {
    toast.current.show({ severity: 'error', summary: 'Network Error', detail: 'Check your inernet connection', life: 3000 });
};

export const showError = (toast) => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
}

export const showSuccess = (toast, message) => {
    toast.current.show({ severity: 'success', summary: 'Correct', detail: message, life: 3000 });
}