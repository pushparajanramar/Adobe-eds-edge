function buildCell(rowIndex, properties) {
    const cell = rowIndex ? document.createElement("td") : document.createElement("th");
    if (!rowIndex) cell.setAttribute("scope", "col");
    
    // Set colspan or rowspan if specified
    if (properties['data-colspan']) cell.colSpan = properties['data-colspan'];
    if (properties['data-rowspan']) cell.rowSpan = properties['data-rowspan'];

    return cell;
}

export default async function decorate(block) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const hasHeader = !block.classList.contains("no-header");
    
    if (hasHeader) table.append(thead);
    table.append(tbody);

    [...block.children].forEach((child, i) => {
        const row = document.createElement("tr");
        const isHeaderRow = hasHeader && i === 0;
        
        if (isHeaderRow) thead.append(row);
        else tbody.append(row);
        
        [...child.children].forEach(col => {
            const properties = parseProperties(col.innerText);
            const cell = buildCell(isHeaderRow ? 0 : 1, properties);
            
            // Remove $...$ tags for display text
            const cellText = col.innerText.replace(/\$.*?\$/g, '').trim();
            cell.innerText = cellText;

            // Check for nested tables
            const nestedTableDiv = col.querySelector('.complextable');
            if (nestedTableDiv) {
                const nestedTable = document.createElement('table');
                parseDivTable(nestedTableDiv, nestedTable); // Recursion for nested tables
                cell.appendChild(nestedTable);
            }
            
            row.append(cell);
        });
    });
    
    block.innerHTML = "";
    block.append(table);
}
