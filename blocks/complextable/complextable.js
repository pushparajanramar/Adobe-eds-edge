function parseProperties(content) {
    const properties = {};
    const matches = content.match(/\$(.*?)\$/g);
    if (matches) {
        matches.forEach(match => {
            const [key, value] = match.replace(/\$/g, '').split('=');
            properties[key.trim()] = value ? value.trim() : true; // Handle true/false values
        });
    }
    return properties;
}

export default async function decorate(block) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    table.append(thead);
    table.append(tbody);

    const rows = Array.from(block.children);

    rows.forEach((div, i) => {
        const content = div.innerText.trim();
        if (content === '') return; // Skip empty divs

        const properties = parseProperties(content);
        const textContent = content.replace(/\$.*?\$/g, '').trim(); // Remove $...$ tags from content

        // Create a new row if it's the first or if it ends a row
        let row;
        if (i === 0 || properties['data-end'] === 'row') {
            row = document.createElement('tr');
            if (properties['data-type'] === 'header') {
                thead.append(row);
            } else {
                tbody.append(row);
            }
        }

        // Determine if it's a header or data cell
        const cell = properties['data-type'] === 'header' ? document.createElement('th') : document.createElement('td');

        // Set text content for the cell
        cell.innerText = textContent;

        // Apply colspan and rowspan if specified
        if (properties['data-colspan']) cell.colSpan = properties['data-colspan'];
        if (properties['data-rowspan']) cell.rowSpan = properties['data-rowspan'];

        // Append the cell to the current row
        row.appendChild(cell);

        // If the row needs to end, append it to the appropriate section
        if (properties['data-end'] === 'row' || i === rows.length - 1) {
            if (row) {
                (properties['data-type'] === 'header' ? thead : tbody).appendChild(row);
            }
        }
    });

    block.innerHTML = '';
    block.append(table);
}
