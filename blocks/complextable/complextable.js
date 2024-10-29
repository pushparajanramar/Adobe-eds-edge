 function decorateTable(container, outputContainer) {
      if (!container) {
        console.error("Container not found:", container);
        return;
      }

      const table = document.createElement('table');
      parseDivTable(container, table);
      outputContainer.appendChild(table);
    }

export default async function decorate(block) {
 
 console.log("export default async function decorate(block) is working");
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
 
