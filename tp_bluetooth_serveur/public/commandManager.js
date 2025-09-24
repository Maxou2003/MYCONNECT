
function changeLedSate(state) {
    fetch(`http://192.168.1.51:3000/led?state=${state}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.text())
        .then(result => {
            console.log('Réponse du serveur :', result);
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Une erreur est survenue');
        });
}

function displayTempChart() {
    getTemperatures().then((data) => {
        // Chart.js comprend les objets Date
        const labels = data.map(d => new Date(d.date));
        const temperatures = data.map(d => d.temperature);

        // S’il y a déjà un graphique, on le détruit avant d’en recréer un
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