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
            const isHeader = header && i === 0; // Check if the current row is the header row
            const cell = buildCell(isHeader ? 0 : 1); // Use 0 for th and 1 for td

            // Remove $...$ from inner content of the col element
            const textContent = col.innerHTML.replace(/\$.*?\$/g, '').trim();

            // Set innerHTML or textContent based on header or data cell
            cell.innerHTML = textContent;

            row.append(cell);
        });
    });

    block.innerHTML = "";
    block.append(table);
}

