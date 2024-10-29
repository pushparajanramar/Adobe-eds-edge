function parseProperties(content) {
    const properties = {};
    const matches = content.match(/\$(.*?)\$/g);
    if (matches) {
        matches.forEach(match => {
            const [key, value] = match.replace(/\$/g, '').split('=');
            properties[key.trim()] = value ? value.trim() : true;
        });
    }
    return properties;
}

function parseRow(row, isHeader) {
    const cells = Array.from(row.children);
    const rowElement = document.createElement('tr');

    cells.forEach(cell => {
        const properties = parseProperties(cell.innerText);
        const cellElement = isHeader ? document.createElement('th') : document.createElement('td');

        // Handle line breaks and remove extra spaces
        const textContent = cell.innerHTML.replace(/<br\s*\/?>/gi, ' ').trim();
        cellElement.innerHTML = textContent;

        // Apply colspan and rowspan if specified
        if (properties['data-colspan']) cellElement.colSpan = properties['data-colspan'];
        if (properties['data-rowspan']) cellElement.rowSpan = properties['data-rowspan'];

        rowElement.appendChild(cellElement);
    });

    return rowElement; // Return the constructed row
}

export default async function decorate(block) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Process header rows
    const headerRows = block.querySelectorAll('thead tr');
    headerRows.forEach(headerRow => {
        const rowElement = parseRow(headerRow, true); // Pass true for header
        thead.appendChild(rowElement);
    });

    // Process body rows
    const bodyRows = block.querySelectorAll('tbody tr');
    bodyRows.forEach(bodyRow => {
        const rowElement = parseRow(bodyRow, false); // Pass false for body
        tbody.appendChild(rowElement);
    });

    table.append(thead);
    table.append(tbody);

    block.innerHTML = ''; // Clear the original content
    block.append(table); // Append the constructed table
}
