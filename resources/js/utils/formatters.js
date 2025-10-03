const locale = typeof window !== 'undefined' ? navigator.language : 'en-US';

export const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') {
        return '';
    }

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
        return value;
    }

    return numberValue.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export const formatDateTime = (value) => {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
    }).format(date);
};

export const getCsrfToken = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
