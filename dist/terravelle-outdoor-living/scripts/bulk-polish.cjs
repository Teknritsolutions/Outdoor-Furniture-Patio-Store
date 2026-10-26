const fs = require('fs');
const file = 'pages/bulk-orders.html';
let html = fs.readFileSync(file, 'utf8');
const icons = ['messages-square', 'layers', 'armchair', 'shield-check'];
html = html.replace(/(<ol class="steps">)([\s\S]*?)(<\/ol>)/, (match, open, body, close) => {
    let index = 0;
    return open + body.replace(/<li>([\s\S]*?)<\/li>/g, (item, content) => {
        const icon = icons[index++];
        if (content.includes('step-icon')) return item;
        return `<li><svg class="icon step-icon" aria-hidden="true"><use href="../assets/icons/lucide.svg#${icon}"></use></svg>${content}</li>`;
    }) + close;
});
fs.writeFileSync(file, html);
