const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const sheetKey = urlParams.get('key');
const module = urlParams.get('module');
const showLogo = urlParams.get('showLogo');

const icons = {
    apal: "images/applied_analytics_logo.svg",
    bigdata: "images/big_data_analytics_logo.svg",
    inf: "images/information_management_logo.svg",
    web: "images/web_engineering_logo.svg",
}

let icon = module ? icons[module] : "images/default.svg";

if (typeof icon === "undefined")
    icon = "images/default.svg"

document.querySelector("#logo").setAttribute("src", icon);

if (showLogo === null || showLogo === "true")
    document.querySelector("#logo").removeAttribute("hidden");

if (!sheetKey || icon === "images/default.svg") {
    document.querySelector("#key_error").removeAttribute("hidden");
}
else {
    Promise.all([
        readSheetData(sheetKey, 1),
        readSheetData(sheetKey, 2),
        readSheetData(sheetKey, 3),
        readSheetData(sheetKey, 4),
        readSheetData(sheetKey, 5)
    ]).then(start);
}

function start(data) {

    for (let c = 0; c < data.length; c++) {

        let content = data[c];
        content = parseModulesColumn(content);
        // Filter by module
        rows = content.rows.filter((r) => { return r.modules.indexOf(module) >= 0 })

        if (rows.length === 0) {
            continue;
        }

        let table = document.querySelector("#table_" + content.title);
        document.querySelector("#card_" + content.title).removeAttribute("hidden");

        for (let i = 0; i < rows.length; i++) {

            addRow(table, content.title, rows[i]);
        }
    }
}

function addRow(table, type, rowData) {

    //console.dir(rowData);

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
            tdElement.innerHTML = `<a href="${rowData.url.trim() + "view"}" target="_blank">Open</a> &nbsp;&nbsp;&nbsp; <a href="${rowData.url.trim() + "export/pdf"}">PDF</a>`;
        else
            tdElement.innerHTML = "-";
    }

    if (['notebooks', 'videos', 'articles'].indexOf(type) >= 0) {
        if (rowData.url.length > 0)
            tdElement.innerHTML = `<a href="${rowData.url.trim()}" target="_blank">Open</a>`;
        else
            tdElement.innerHTML = "-";
    }

    if (type === "datasets") {
        if (rowData.url.length > 0)
            tdElement.innerHTML = `<a href="${rowData.url.trim()}" target="_blank">Download</a>&nbsp;&nbsp;&nbsp;<a href="${rowData.templateurl.trim()}" target="_blank">Template</a>`;
        else {
            tdElement.innerHTML = "-";
        }
    }

    trElement.appendChild(tdElement);

    table.appendChild(trElement);
}


function parseModulesColumn(content) {

    for (let i = 0; i < content.rows.length; i++) {
        let modules = content.rows[i].modules;


        if (modules.length > 0) {
            let modulesArray = modules.split(",");
            content.rows[i].modules = modulesArray;
        } else {
            content.rows[i].modules = [];
        }
    }
    return content;
}