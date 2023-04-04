const fileList = document.getElementById('file-list');
const output = document.getElementById('output');
const fileInput = document.getElementById('file-input');
const selectFilesButton = document.getElementById('select-files');

selectFilesButton.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    if (files) {
        fileList.innerHTML = '';
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.name.endsWith('.json')) {
                const li = document.createElement('li');
                li.textContent = file.name;
                li.addEventListener('click', () => {
                    loadJsonFile(file, true);
                });
                fileList.appendChild(li);
            }
        }
    }
});

function loadJsonFile(file, isFileObject = false) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const jsonData = JSON.parse(event.target.result);
        output.textContent = createParagraph(jsonData);
    };
    if (isFileObject) {
        reader.readAsText(file);
    } else {
        fetch(file)
            .then((response) => response.blob())
            .then((blob) => reader.readAsText(blob));
    }
}

function flattenObject(obj, prefix = "") {
    const result = {};
    for (const key in obj) {
        const newKey = prefix ? prefix + "." + key : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
            Object.assign(result, flattenObject(obj[key], newKey));
        } else {
            result[newKey] = obj[key];
        }
    }
    return result;
}
function createTable(data) {
    const flattenedData = flattenObject(data);
    let table = '<table class="resizable" style="border-collapse: collapse; border-spacing: 0;">';
    let newLineEntry = true;
    let rowCounter = 0;
    let colCounter = 0;
    for (const key in flattenedData) {
        if (key.match(/^(\d+):/)) {
            const rowNumber = parseInt(key.match(/^(\d+):/)[1]);
            if (rowNumber > rowCounter) {
                while (colCounter > 0) {
                    table += '<td style="border: 1px solid #ddd; padding: 8px; text-align: left;"></td>';
                    colCounter--;
                }
                if (newLineEntry === false) {
                    table += '</tr>';
                }
                table += '<tr>';
                rowCounter++;
                colCounter = 0;
                newLineEntry = true;
            }
            table += '<td style="border: 1px solid #ddd; padding: 8px; text-align: left;">' + flattenedData[key] + '</td>';
            colCounter++;
        } else if (key.match(/^(\d+)\./)) {
            const rowNumber = parseInt(key.match(/^(\d+)\./)[1]);
            if (rowNumber > rowCounter) {
                while (colCounter > 0) {
                    table += '<td style="border: 1px solid #ddd; padding: 8px; text-align: left;"></td>';
                    colCounter--;
                }
                if (newLineEntry === false) {
                    table += '</tr>';
                }
                table += '<tr>';
                rowCounter++;
                colCounter = 0;
                newLineEntry = true;
            }
            table += '<td style="border: 1px solid #ddd; padding: 8px; text-align: left;">' + flattenedData[key] + '</td>';
            colCounter++;
        } else {
            if (newLineEntry) {
                table += '<tr>';
                newLineEntry = false;
            }
            table += '<td style="border: 1px solid #ddd; padding: 8px; text-align: left;">' + key + ': ' + flattenedData[key] + '</td>';
            if (newLineEntry === false) {
                table += '</tr>';
                colCounter++;
                if (colCounter === rowCounter) {
                    table += '</tr>';
                    rowCounter = 0;
                    colCounter = 0;
                    newLineEntry = true;
                }
            }
        }
    }
    if (newLineEntry === false) {
        while (colCounter < rowCounter) {
            table += '<td style="border: 1px solid #ddd; padding: 8px; text-align: left;"></td>';
            colCounter++;
        }
        table += '</tr>';
    }
    table += '</table>';
    return table;
}


function loadJsonFile(file, isFileObject = false) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const jsonData = JSON.parse(event.target.result);
        output.innerHTML = createTable(jsonData);
    };
    if (isFileObject) {
        reader.readAsText(file);
    } else {
        fetch(file)
            .then((response) => response.blob())
            .then((blob) => reader.readAsText(blob));
    }
}

