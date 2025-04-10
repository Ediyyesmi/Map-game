let totalScore = 0;
let countries = [];
let correctCountry = null;
let questionScore = 20;
let counter=1;
let previousCountryId = null;

startgame();
function startgame() {
  questionScore = 20; // Question score sıfırlanıyor
  document.getElementById("questionscore").innerText = `${questionScore}p`;
  fetch('./src/eu.json')
    .then(Response => Response.json())
    .then(data => {
      countries = data;
      let index = Math.floor(Math.random() * data.length);
      let randomCountry = data[index];
      correctCountry = randomCountry;
      console.log(randomCountry);
      dom(randomCountry.id);
      resetHintListeners(); // Eski event listener'ları kaldır
      hint(randomCountry); // Yeni event listener'ları ekle
      const flag = document.getElementById("flagicon");
      flag.src = "./img/flag.svg";
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";
      let scorediv=document.getElementById("totalScore");
      scorediv.innerHTML=totalScore+" p";
      document.getElementById("searchInput").value = "";

    })
    .catch(error => console.error("Error fetching JSON!", error));
}

function resetHintListeners() {
  const flag = document.getElementById("flagicon");
  const currency = document.getElementById("currency");
  const capital = document.getElementById("capital");

  // Eski event listener'ları kaldır
  const newFlag = flag.cloneNode(true);
  const newCurrency = currency.cloneNode(true);
  const newCapital = capital.cloneNode(true);

  flag.parentNode.replaceChild(newFlag, flag);
  currency.parentNode.replaceChild(newCurrency, currency);
  capital.parentNode.replaceChild(newCapital, capital);
}

function dom(id) {
  const path = document.getElementById(id);
  // Fill özelliğini ekle (veya değiştir)
  path.setAttribute("fill", "#ffcc00"); // örnek olarak sarı renk

  // Update the previous country ID
  previousCountryId = id;
}

function hint(randomCountry) {
  const flag = document.getElementById("flagicon");
  const currency = document.getElementById("currency");
  const capital = document.getElementById("capital");
  let flagIsclicked =0;
  let currencyIsclicked =0;
  let capitalIsclicked =0;
  
  flag.addEventListener("click", () => {
    
    if(flagIsclicked==0){
      questionScore -= 7;
    }
       console.log(questionScore)
       document.getElementById("questionscore").innerText = `${questionScore}p`;
       let newflag = randomCountry.flag;
       flag.src = newflag;
       flagIsclicked=1;
  });

  capital.addEventListener("click", () => {
    
    if(capitalIsclicked==0){
      questionScore -= 5;
    }
       document.getElementById("questionscore").innerText = `${questionScore}p`;
       Swal.fire("Capital: " + randomCountry.capital);
       capitalIsclicked=1;
  })

  currency.addEventListener("click", () => {
    
    if(currencyIsclicked==0){
      questionScore -= 3;
    }
      document.getElementById("questionscore").innerText = `${questionScore}p`;
      Swal.fire("Currency: " + randomCountry.currency);
      currencyIsclicked=1;
  })

}


const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase();

  const filtered = countries.filter(country =>
    country.country.toLowerCase().includes(query)
  );

  displayResults(filtered);
});

function displayResults(list) {
  resultsDiv.innerHTML = "";
  const limitedList = list.slice(0, 3);

  if (limitedList.length === 0) {
    resultsDiv.innerHTML = "";
    return;
  }

  limitedList.forEach(country => {
    const item = document.createElement("div");
    item.innerHTML = `<strong>${country.country}</strong>`;
    item.classList.add("result-item");
    item.addEventListener("click", () => {
      checkAnswer(country, correctCountry);
    });
    resultsDiv.appendChild(item);
  });
}

function checkAnswer(selectedCountry, correctCountry) {
  if (selectedCountry.country === correctCountry.country) {
  // Reset the previous country's color
    if (previousCountryId) {
      const previousPath = document.getElementById(previousCountryId);
      if (previousPath) {
        previousPath.setAttribute("fill", "#23d160"); // Reset to default color (e.g., gray)
      }
    }
    let previousScore = totalScore;
    totalScore += questionScore;

    let currentDisplayScore = previousScore;
    const animationSpeed = 50; // ms
    const increment = 1;

    Swal.fire({
      title: "Correct answer",
      icon: "success",
      html: `Total Score: <b id="scoreCounter">${previousScore}</b> points ⭐`,
      timer: 3000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();

        const scoreEl = Swal.getPopup().querySelector("#scoreCounter");
        const interval = setInterval(() => {
          currentDisplayScore += increment;
          if (currentDisplayScore >= totalScore) {
            currentDisplayScore = totalScore;
            clearInterval(interval);
          }
          scoreEl.textContent = currentDisplayScore;
        }, animationSpeed);
      },
      willClose: () => {
        
      }
    }).then((result) => {
      counter++;
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
      if(counter<=5){
        startgame();
      }
      else if(counter >5){
        Swal.fire("Game Ended! <br> Your total score is:" + totalScore);
      }
    });

  } else {
    // Reset the previous country's color
    if (previousCountryId) {
      const previousPath = document.getElementById(previousCountryId);
      if (previousPath) {
        previousPath.setAttribute("fill", "#D2042D"); // Reset to default color (e.g., gray)
      }
    counter++;
    Swal.fire("❌ Wrong answer. <br> Correct Answer is:" + correctCountry.country);
    if(counter<=5){
      startgame();
    }
    else if(counter >5){
      Swal.fire("Game Ended! <br> Your total score is:" + totalScore);
    }
  }
}
}
