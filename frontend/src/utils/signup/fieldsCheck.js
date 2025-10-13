export function checkAllFieldsFilled(formState) {
    const keys = Object.keys(formState);
    for (const key of keys) {
        if (key === 'rememberMe') {
            continue;
        }

        const value = formState[key];
        if (value === null || typeof value === 'undefined' || String(value).trim() === '') {
            return false;
        }
    }
    return true;
}