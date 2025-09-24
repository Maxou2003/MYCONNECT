
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
    var monGraphique = new Chart('myChart', {
        type: 'line',
        data: {
            // Dans la ligne ci-dessous doit apparaitre les dates des différentes points à afficher sur le graphique, sous forme d'un tableau
            labels: ['2023-09-25 16:48:37', '2023-09-25 16:48:43', '2023-09-25 16:48:49', '2023-09-25 16:48:55', '2023-09-25 16:49:01'],
            datasets: [
                {
                    label: 'Température',
                    // Dans la ligne ci-dessous doit apparaitre les valeurs des différents points de température à afficher sur le graphique, sous forme d'un tableau
                    data: [22, 22.5, 22.7, 22.9, 22.6],
                    yAxisID: 'A',
                    backgroundColor: 'rgba(255, 238, 186, 0.4)',
                    borderColor: 'rgba(255, 125, 0, 1)',
                    borderWidth: 1,
                    spanGaps: true
                },
                {
                    label: 'led',
                    // On pourrait aussi afficher l'historique de l'état de la led : "1" pour allumée et "0" pour éteinte
                    data: [1, 0, 0, 1, 1],
                    yAxisID: 'B',
                    backgroundColor: 'rgba(184, 218, 255, 0.4)',
                    borderColor: 'rgba(184, 218, 255, 1)',
                    borderWidth: 1,
                    spanGaps: true,
                    steppedLine: 'before'
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
                        unit: 'minute'
                    }
                }],
                yAxes: [
                    {
                        id: 'A',
                        ticks: {
                            beginAtZero: true
                        }
                    },
                    {
                        id: 'B',
                        ticks: {
                            min: 0,
                            max: 2,
                            beginAtZero: true
                        }
                    }
                ]
            }
        }
    })
}


