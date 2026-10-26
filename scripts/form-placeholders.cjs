const fs = require('fs');
const hints = {
    name: 'Enter your full name',
    'full-name': 'Enter your full name',
    'company-name': 'Enter your company name',
    subject: 'What would you like to discuss?',
    'estimated-quantity': 'e.g. 24',
    'number-of-visitors': 'e.g. 2',
    'additional-message': 'Tell us about your space, interests, or visit requirements',
};
const choices = {
    'business-type': 'Select your business type',
    'product-category': 'Select a product category',
    'project-timeline': 'Select your project timeline',
    'preferred-time': 'Select a preferred time',
    'purpose-of-visit': 'Select your visit purpose',
};
for (const file of fs.readdirSync('pages').filter(file => file.endsWith('.html'))) {
    const path = `pages/${file}`;
    let html = fs.readFileSync(path, 'utf8');
    html = html.replace(/<(input|textarea)\b[^>]*>/g, tag => {
        if (/\bplaceholder=/.test(tag)) return tag;
        const id = tag.match(/\bid="([^"]+)"/)?.[1];
        const type = tag.match(/\btype="([^"]+)"/)?.[1];
        let hint = hints[id];
        if (type === 'email') hint = 'you@example.com';
        if (type === 'tel') hint = 'e.g. +1 202 555 0148';
        if (id === 'message') hint = file === 'bulk-orders.html'
            ? 'Share your project size, preferred pieces, location, and requirements'
            : 'Tell us how we can help with your outdoor space';
        return hint ? tag.replace(/\s*\/?>(?=$)/, end => ` placeholder="${hint}"${end}`) : tag;
    });
    html = html.replace(/(<select\b[^>]*id="([^"]+)"[^>]*>\s*<option value="">)[^<]*(<\/option>)/g,
        (match, start, id, end) => choices[id] ? start + choices[id] + end : match);
    fs.writeFileSync(path, html);
}
