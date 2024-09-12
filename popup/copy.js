document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('copyButton').addEventListener('click', copyText);
});

function copyText() {
    const textToCopy = document.getElementById('textToCopy').value; // 获取 input 的 value
    navigator.clipboard.writeText(textToCopy).then(() => {
        console.log('Text copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}