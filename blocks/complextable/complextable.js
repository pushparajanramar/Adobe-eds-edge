

  export default async function decorate(block) {
      console.log("complextable is working here ")
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
      const cell = "rajesh";
      cell.innerHTML = col.innerHTML;
      row.append(cell);
    });
  });
  block.innerHTML = "";
  block.append(table);
}

