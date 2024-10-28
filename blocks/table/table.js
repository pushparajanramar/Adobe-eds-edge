function buildCell(rowIndex) {
    const cell = rowIndex ?
        document.createElement("td") :
        document.createElement("th");
    if (!rowIndex) cell.setAttribute("scope", "col");
    return cell;
}

export default async function decorate(block) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const header = !block.classList.contains("no-header");
    if (header) table.append(thead);
    table.append(tbody);

    [...block.children].forEach((child, i) => {
        const row = document.createElement("tr");
        if (header && i === 0) thead.append(row);
        else tbody.append(row);
        
        [...child.children].forEach((col) => {
            const cell = buildCell(header ? i : i + 1);

            // Check if the cell is a header or a data cell
            const isHeader = header && i === 0; // Assuming the first row is the header

            // Get the content and check for $ signs
            const cellContent = col.innerHTML;
            if (cellContent.includes('$')) {
                console.log('Found $ in cell content:', cellContent);
            }

            // Set the innerHTML of the cell
            cell.innerHTML = cellContent;
            row.append(cell);
        });
    });

    block.innerHTML = "";
    block.append(table);
}
