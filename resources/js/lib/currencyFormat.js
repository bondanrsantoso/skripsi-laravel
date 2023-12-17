export function formatCurrency(amount, currency = "IDR", locale = "id-ID") {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(amount);
}
