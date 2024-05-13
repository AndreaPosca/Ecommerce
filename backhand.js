//Puntatori e variabili generiche 

let aggiuntaBottone = document.getElementById("container-bottoni");
let productForm = document.getElementById("product-form");
let newCard = document.getElementById("new-card");
let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNlMzAxMzcyYjNlYTAwMTU3MWZjYzAiLCJpYXQiOjE3MTU1OTMxNjMsImV4cCI6MTcxNjgwMjc2M30.l09hErRafsqAWFS27MGfWd9Ke8sRxDgfM21XBiQ9sJg";
const url = 'https://striveschool-api.herokuapp.com/api/product/';
const key = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhMjRmYjBiM2IyNTAwMTUxYjU0MzkiLCJpYXQiOjE3MTUwODY3NjAsImV4cCI6MTcxNjI5NjM2MH0.tRa62s9gug_d79Gkyhqtjuom2FK46USw_JKaSQ2e0Vw";


//Funzione che al caricamento della pagina richiama la funzione get prodotti
document.addEventListener("DOMContentLoaded", function () {
    ottieniProdotti ()
})

// Funzione per ottenere un nuovo prodotto dal server
const ottieniProdotti = async() => {
    await fetch(url, {headers: {Authorization: token}})    
            .then((response) => {return response.json();
             }) 
            .then((prodotti) => {
                // Itero i prodotti che ho ricevuto in risposta e precedentemente convertito in json
                prodotti.forEach((prodotto) => aggiungiNuovoProdotto (prodotto))
                console.log("Prodotti Caricati");
                console.log(prodotti);//Controlli vari
            })
            // Gestisco eventuali errori durante la richiesta
            .catch((error) => {return console.error("Errore:", error)});
} 
// Creo la funzione per aggiungere un nuovo prodotto 
function aggiungiNuovoProdotto (prodotto) {
    //creo un div dove inserire il prodotto 
    const newProduct = document.createElement("div");
    newProduct.classList.add('col');

    //inserisco l'immaggine
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");
    const img = document.createElement('img');
    img.setAttribute('src', prodotto.imageUrl);

    //inserirsco le info di  testo del prodotto 
    const textInfoContainer = document.createElement('div');
    textInfoContainer.classList.add('text-info-container');
    const nomeProdotto = document.createElement("h4");
    nomeProdotto.innerText = prodotto.name;
    const descrizioneProdotto = document.createElement("p");
    descrizioneProdotto.innerText = prodotto.description;
    const brandProdotto = document.createElement("span");
    brandProdotto.innerText = prodotto.brand;
    const prezzoProdotto = document.createElement("h5");
    prezzoProdotto.innerText = "euro" + prodotto.price;
    const idProdotto = prodotto.id;

    //per utility inserisco un div che conterra i tasti di delete e modifica
    const divContainer = document.createElement("div");
    divContainer.classList.add("button-container");

    //bottone di modifica

    //Controllo prima di proseguire
    
    
    //Aggiungo tutto  al div creato prima "newProduct" e dopo appendo in HTML
    newProduct.appendChild(img);
    newProduct.appendChild(textInfoContainer);
    newProduct.appendChild(descrizioneProdotto);
    newProduct.appendChild(brandProdotto);
    newProduct.appendChild(prezzoProdotto);
   // newProduct.appendChild(bottoneModifica); //aggiungo il tasto modifica
   // newProduct.appendChild(bottoneElimina); // aggiungo il tatso elimina

    //Appendo infine tutto sulla variabile puntata all'inizio newCard
    newCard.appendChild(newProduct)
}

// Puntatore del bottone invia
const invioModuloForm = document.getElementById("invio-modulo-form");
//aggiungo l'event listener
//al click sul bottone "invia"
//con preventDefault evito di aggiornare la pagina
//creo l'oggetto nuovoOggettoServer, ricavo i dati da inserire al suo interno dai campi del form
invioModuloForm.addEventListener('click', function(event) {
    console.log('Click su Add');
    event.preventDefault();

    //faccio delle verifiche sul prezzo inserito, converto la stringa in numero decimale
    const correctPrice = parseFloat(document.getElementById('price').value);
    //così posso verificare se è stato inserito un numero e se è maggiore di zero
    if (isNaN(correctPrice) || correctPrice <= 0 || !(/^\d+(\.\d{1,2})?$/.test(correctPrice))) {
        alert('Il prezzo non è un numero valido o è inferiore o uguale a 0, riprova con un numero maggiore di 0');
    }    
  const nuovoProdotto = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    imageUrl: document.getElementById('image').value,
    brand: document.getElementById('brand').value,
    price: correctPrice
}

//infine faccio un controllo con il console.log
//mando come parametro l'oggetto appena creato alla funzione mandaProdotto
console.log(nuovoProdotto);
mandaProdotto(nuovoProdotto);
});

//inviato l'oggetto in questa funzione, ulitizzo il metodo POST per creare un nuovo elemento da caricate sul server
const mandaProdotto = async(nuovoInserimento) =>  {

    await fetch("https://striveschool-api.herokuapp.com/api/product/", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: token},
        body: JSON.stringify(nuovoInserimento)
      }
    )
   .then(response => {
    if (response.ok) {
        return response.json();
    }
})
    .then(response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 404) {
            throw new Error('Risorsa non trovata' + response.status);
        } else if (response.status === 500) {
            throw new Error('Errore del server' + response.status);
        } else {
            throw new Error('Errore durante la aggiunta del prodotto' + response.status);
        }
    })
    //se va a buon fine la richiesta, ricarico la pagina in modo tale che la funzione carica gli oggetti e li inserisce in HTML
    //inserisce anche il nuovo oggetto
    .then((nuovoInserimento) => {
        window.location.reload();
        //messageON("Prodotto aggiunto con successo!")
        console.log("Prodotto aggiunto con successo!", nuovoInserimento);
    })
    //se non va a buon fine stampra messaggio di errore in console
    .catch((error) => {
        console.error("Errore durante l'aggiunta del prodotto:", error.message);
        alert("Si è verificato un errore durante l'aggiunta del prodotto. Si prega di riprovare più tardi.");
        //messageON("Errore!");
    });

}

//Funzioni per il bottone di modifica
function modifyObjects (object) {
    console.log("modifico l'articolo");
    document.getElementById('name').value = object.name
    document.getElementById('description').value = object.description
    document.getElementById('image').value = object.imageUrl
    document.getElementById('brand').value = object.brand
    document.getElementById('price').value = object.price


    //appendo sull puntatore fissato all'inizio
    aggiuntaBottone.appendChild(changeButton);
    // aggiungo l'event listener
    changeButton.addEventListener("click", function(event) {
        //evito alla pagina il refresh
        event.preventDefault();
        //do alla seguente funzione il parametro object
    })

}