(() => {
  const cardDom = document.getElementById("card_list");
  const numberArr = [];
  let firsCard = undefined;
  let secondCard = undefined;

  // Этап 1. Создайте функцию, генерирующую массив парных чисел. Пример массива, который должна возвратить функция: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8].count - количество пар.

  function createNumbersArray(count) {
    for (let i = 1; i <= count; i++) {
      numberArr.push(i, i);
    }
    return numberArr;
  };

  // Этап 2. Создайте функцию перемешивания массива.Функция принимает в аргументе исходный массив и возвращает перемешанный массив. arr - массив чисел

  function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
      let randomIndex = Math.floor(Math.random() * arr.length);
      let temp = arr[i];
      arr[i] = arr[randomIndex];
      arr[randomIndex] = temp;
    }
    return arr;
  };

  // Этап 3. Используйте две созданные функции для создания массива перемешанными номерами. На основе этого массива вы можете создать DOM-элементы карточек. У каждой карточки будет свой номер из массива произвольных чисел. Вы также можете создать для этого специальную функцию. count - количество пар.

  function createCard(arr) {
    let cardItem = document.createElement("li");
    cardItem.classList.add('card__item');
    cardItem.textContent = arr;

    cardItem.addEventListener("click", function () {
      if (cardItem.classList.contains('card__open') || cardItem.classList.contains('card__success')) {
      }

      if (firsCard !== undefined && secondCard !== undefined) {
        firsCard.classList.remove('card__open');
        secondCard.classList.remove('card__open');
        firsCard = undefined;
        secondCard = undefined;
      }

      cardItem.classList.add('card__open');
      if (firsCard === undefined) {
        firsCard = cardItem;
      } else {
        secondCard = cardItem;
      }
      if (firsCard !== undefined && secondCard !== undefined) {
        let firsNumber = firsCard.textContent;
        let secondNumber = secondCard.textContent;
        if (firsNumber === secondNumber) {
          firsCard.classList.add('card__success');
          secondCard.classList.add('card__success');
        }
      }
      if (numberArr.length === document.querySelectorAll(".card__success").length) {
        setTimeout(function () {
          cardDom.innerHTML = '';
          alert("Вы нашли все пары!");
          let cardCount = Number(prompt("Введите кол-во пар", 4));
          startGame(cardCount);
        }, 300);
      }
    })

    return cardItem;
  };

  function startGame(count) {
    let arr = createNumbersArray(count);
    let randomNumber = shuffle(arr);
    for (const randomArr of randomNumber) {
      let cardList = createCard(randomArr);
      cardDom.append(cardList);
    }
  };

  let cardCount = Number(prompt("Введите кол-во пар", 4));
  let columns = Number(prompt("Введите кол-во столбцов", 4));
  console.log(columns);
  cardDom.style = `grid-template-columns: repeat(${columns}, 1fr);`;
  startGame(cardCount);

})();
