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

function parseDivTable(divTable, parentTable, isHeader = false) {
    const rows = Array.from(divTable.children);
    
    rows.forEach(div => {
        const cells = Array.from(div.children);
        const rowElement = document.createElement(isHeader ? 'tr' : 'tr'); // Create a new row

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

        parentTable.appendChild(rowElement); // Append the constructed row to the parent table
    });
}

export default async function decorate(block) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Assuming the first child is the header section
    const headerDiv = block.querySelector('thead');
    const bodyDiv = block.querySelector('tbody');

    parseDivTable(headerDiv, thead, true); // Pass header div for header processing
    parseDivTable(bodyDiv, tbody, false); // Process body separately for rows

    table.append(thead);
    table.append(tbody);

    block.innerHTML = ''; // Clear the original content
    block.append(table); // Append the constructed table
}
