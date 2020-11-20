const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const sheetKey = urlParams.get('key');

Promise.all([
    readSheetData(sheetKey, 1),
    readSheetData(sheetKey, 2),
    readSheetData(sheetKey, 3),
    readSheetData(sheetKey, 4),
    readSheetData(sheetKey, 5)
]).then(start);

function start(data) {
    console.dir(data);

    for (let c = 0; c < data.length; c++) {

        let content = data[c];

        if (content.rows.length === 0) {
            continue;
        }

        let table = document.querySelector("#table_" + content.title);
        document.querySelector("#card_" + content.title).removeAttribute("hidden");

        for (let i = 0; i < content.rows.length; i++) {

            addRow(table, content.title, content.rows[i]);
        }
    }
}

function addRow(table, type, rowData) {

    console.dir(rowData);

    let trElement = document.createElement("tr");

    let tdElement;

    // Title
    tdElement = document.createElement("td");
    tdElement.textContent = rowData.title;
    trElement.appendChild(tdElement);

    // Links
    tdElement = document.createElement("td");

    tdElement.style.width = "300px";
    tdElement.classList.add("text-right");

    if (type === "slides") {
        if (rowData.url.length > 0)
            tdElement.innerHTML = `<a href="${rowData.url + "view"}" target="_blank">Open</a> &nbsp;&nbsp;&nbsp; <a href="${rowData.url + "export/pdf"}">PDF</a>`;
        else
            tdElement.innerHTML = "-";
    }

    if (['notebooks', 'videos', 'articles'].indexOf(type) >= 0) {
        if (rowData.url.length > 0)
            tdElement.innerHTML = `<a href="${rowData.url}" target="_blank">Open</a>`;
        else
            tdElement.innerHTML = "-";
    }

    if (type === "datasets") {
        if (rowData.url.length > 0)
            tdElement.innerHTML = `<a href="${rowData.url}" target="_blank">Download</a>&nbsp;&nbsp;&nbsp;<a href="${rowData.templateurl}" target="_blank">Template</a>`;
        else {
            tdElement.innerHTML = "-";
        }
    }

    trElement.appendChild(tdElement);

    table.appendChild(trElement);
}
