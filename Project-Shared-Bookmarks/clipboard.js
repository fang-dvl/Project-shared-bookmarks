export async function copyToClipboard(url) {
    await navigator.clipboard.writeText(url);
}