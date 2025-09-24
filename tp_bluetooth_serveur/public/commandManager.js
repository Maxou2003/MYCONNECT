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

function displayTempHistory(){

}


    