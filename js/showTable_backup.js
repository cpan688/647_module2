export function showTable(data, fields) {
    console.log("showTable() is running");
    const defaultColor = 'goldenrod';
    const defaultPadding = '0 0.5em';
    const defaultBorder = `2px solid ${defaultColor}`;

    const table = document.createElement('table');
    const row = document.createElement('tr');

    data.forEach((item, index) => {
        const cell = document.createElement('td');
        cell.style.padding = defaultPadding;
        cell.style.border = defaultBorder;

        // Build cell content (line breaks between fields)
        fields.forEach((f, i) => {
            const label = f.name ? `${f.name}: ` : '';
            const value = item[f.label] ?? '';
            const text = document.createTextNode(label + value);
            cell.appendChild(text);
            if (i < fields.length - 1) cell.appendChild(document.createElement('br'));
        });

        row.appendChild(cell);
    });

    table.appendChild(row);
    return table;
}
