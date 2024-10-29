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
      const tableDivs = document.querySelectorAll(".complextable div");
      var newDiv = document.createElement('div');
      [...tableDivs].forEach((div, index) => {
        newDiv.appendChild(div);
      });
      // Create a new div element
      const custumID = document.createElement('div');
      custumID.id = 'newDivId'; // replace 'newDivId' with your desired ID
      const wrapper = document.querySelector('.complextable-wrapper');
      // Append the new div after the wrapper
      wrapper.insertAdjacentElement('afterend', custumID);
      const outputContainer = document.getElementById('newDivId');
      outputContainer.innerHTML = ''; // Clear previous output
     decorateTable(newDiv, outputContainer);
}
