function buildCell(rowIndex) {
  const cell = rowIndex ? document.createElement("td") : document.createElement("th");
  if (!rowIndex) cell.setAttribute("scope", "col");
  return cell;
}

function parseProperties(content) {
  const properties = {};
  const regex = /\$(.*?)\$/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const [key, value] = match[1].split('=');
    properties[key.trim()] = value ? value.trim() : true;
  }
  return properties;
}

function decorateTable(container, outputContainer) {
  if (!container) {
    console.error("Container not found:", container);
    return;
  }

  const table = document.createElement('table');
  parseDivTable(container, table);
  outputContainer.appendChild(table);
}

function parseDivTable(divTable, parentTable) {
  const rows = Array.from(divTable.children);
  let currentRow = document.createElement('tr');

  rows.forEach((div, index) => {
    const content = div.innerText.trim();
    if (content === '') return; // Skip empty divs

    const properties = parseProperties(content);
    const textContent = content.replace(/\$.*?\$/g, '').trim();

    const cell = properties['data-type'] === 'header' ? document.createElement('th') : document.createElement('td');

    const nestedTableDiv = div.querySelector('.complextable');
    if (nestedTableDiv) {
      const nestedTable = document.createElement('table');
      parseDivTable(nestedTableDiv, nestedTable);
      cell.appendChild(nestedTable);
    } else {
      cell.innerText = textContent;
    }

    if (properties['data-colspan']) cell.colSpan = properties['data-colspan'];
    if (properties['data-rowspan']) cell.rowSpan = properties['data-rowspan'];

    currentRow.appendChild(cell);

    if (properties['data-end'] === 'row' || index === rows.length - 1) {
      parentTable.appendChild(currentRow);
      currentRow = document.createElement('tr');
    }
  });
}

export default async function decorate(block) {
  console.log("(block) is working");
  
  const container = document.querySelector(".complextable");
  if (!container) {
    console.error("Container '.complextable' not found.");
    return;
  }

  const tableDivs = container.querySelectorAll("div");
  const newDiv = document.createElement('div');

  tableDivs.forEach(div => {
    const clonedDiv = div.cloneNode(true); // Clone instead of moving
    newDiv.appendChild(clonedDiv);
  });

  const outputContainer = container;
  if (!outputContainer) {
    console.error("Output container '#Div1' not found.");
    return;
  }
  
  outputContainer.innerHTML = ''; // Clear previous output
  decorateTable(newDiv, outputContainer);
}
