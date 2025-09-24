setInterval(()=>{
    getLedState();
    },500);

    
function changeLedVisual(state){

    let ampoule = document.getElementById('ampoule')
    if (state){
        ampoule.classList.add("on");
    }else{
       ampoule.classList.remove("on"); 
    }
}

async function getLedState(){
      fetch(`http://192.168.1.51:3000/led/state`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then(async (response)=>{
           let resp = await response.json()
           changeLedVisual( resp.state);
           return await response;
        })
        .catch((err)=>{
            console.log(err);
        })
      
}