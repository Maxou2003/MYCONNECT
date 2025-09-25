let displayedElement = null;
let currentPage = 1;
const rowsPerPage = 5;

function commandManager(element) {
    changeDisplayedElement(element);

    if (element === 'myChart') {
        displayTempChart();
    }
    else if (element === 'table-container') {
        displayTempTable();
    }
}


function changeDisplayedElement(element) {
    if (displayedElement) {
        displayedElement.style.display = 'none';
    }
    displayedElement = document.getElementById(element);

    if (displayedElement) {
        displayedElement.style.display = 'block';
    }
}

function displayTempChart() {
    getTemperatures().then((data) => {

        const labels = data.map(d => new Date(d.date));
        const temperatures = data.map(d => d.temperature);

        if (window.monGraphique) {
            window.monGraphique.destroy();
        }

        const ctx = document.getElementById('myChart').getContext('2d');
        window.monGraphique = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Température',
                        data: temperatures,
                        yAxisID: 'A',
                        backgroundColor: 'rgba(255, 238, 186, 0.4)',
                        borderColor: 'rgba(255, 125, 0, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true,
                    }
                ]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'minute',
                            tooltipFormat: 'YYYY-MM-DD HH:mm:ss'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        }
                    }],
                    yAxes: [{
                        id: 'A',
                        ticks: {
                            beginAtZero: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Température (°C)'
                        }
                    }]
                }
            }
        });
    })
        .catch((err) => {
            console.error('Erreur lors de la récupération des températures :', err);
        });

}


function displayTempTable(page = 1) {
    getTemperatures().then((data) => {
        const table = document.getElementById('myTable');
        const pagination = document.getElementById('pagination');
        table.innerHTML = '';
        pagination.innerHTML = '';

        // Pagination
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = data.slice(start, end);

        // En-tête
        const header = table.createTHead();
        const headerRow = header.insertRow(0);
        ['Date', 'Température (°C)'].forEach(text => {
            const cell = document.createElement('th');
            cell.innerText = text;
            headerRow.appendChild(cell);
        });

        // Corps du tableau
        const body = table.createTBody();
        paginatedData.forEach((entry) => {
            const row = body.insertRow();
            row.insertCell(0).innerText = new Date(entry.date).toLocaleString();
            row.insertCell(1).innerText = entry.temperature.toFixed(2);
        });

        // Boutons de pagination
        const pageCount = Math.ceil(data.length / rowsPerPage);
        for (let i = 1; i <= pageCount; i++) {
            const btn = document.createElement('button');
            btn.innerText = i;
            btn.style.margin = "0 5px";
            btn.onclick = () => {
                currentPage = i;
                displayTempTable(i);
            };
            if (i === page) {
                btn.style.fontWeight = "bold";
            }
            pagination.appendChild(btn);
        }
    })
        .catch((err) => {
            console.error('Erreur lors de la récupération des températures :', err);
        });
}


async function getTemperatures() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/gettemperatures`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const resp = await response.json();
        return resp;
    } catch (err) {
        console.error('Erreur dans getTemperatures:', err);
        throw err;
    }
}