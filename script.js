// Array of vocabulary words
let vocabulary = JSON.parse(localStorage.getItem("vocabulary")) || [
    {
        word: "마침맞다",
        meaning: "어떤 경우나 기회에 꼭 알맞다.",
        example: "시누이에게 <span style='font-weight: bold; color: #e74c3c;'>마침맞은</span> 남편감을 찾아줬다. <br> 이 일에 <span style='font-weight: bold; color: #e74c3c;'>마침맞은</span> 사람을 알고 있다.",
        relatedWords: "알맞다: 일정한 기준&comma; 조건&comma; 정도 따위에 넘치거나 모자라지 않다. 마침하다: 무엇에 아주 알맞다. "
    },
    { 
        word: "마수걸이", 
        meaning: "맨 처음으로 부딪는 일. 맨 처음으로 물건을 파는 일. 또는 거기서 얻은 소득.", 
        example: "마수걸이치고는 짭짤한 소득을 얻었다. 손흥민 선수가 4경기 만에 드디어 시즌 마수걸이 골을 넣었다.", 
        relatedWords: "개시: 하루 중 처음으로 또는 가계 문을 연뒤 처음으로 이루어지는 거래" 
    },
    { 
        word: "너울가지", 
        meaning: "남과 잘 사귀는 성질이나 수단.", 
        example: "그는 너울가지가 좋아 사람을 만나는 직업에 잘 맞는다. 이준이는 MBTI가 ENFP라 그런지 너울가지가 참 좋다. <br/> 너울가지가 좋은 아이로 키우고 싶다.", 
        relatedWords: "붙임성: 남과 잘 사귀는 성질는 성질이나 수단., 포용성: 남을 너그럽게 감싸 주거나 받아들이는 성질." 
    },
    { 
        word: "대거리", 
        meaning: "1) 상대편에서 맞서서 대듦, 또는 그런 말이나 행동. 2) 서로 상대의 행동이나 말에 응하여 행동이나 말을 주고 받음.", 
        example: "엄마는 평소 사이가 안 좋은 옆집 아줌마와 대거리를 하였다. <br/> 그런 작은 일까지 일일이 대거리할 필요없다.", 
        relatedWords: "대응: 어떤 일이나 사태에 맞추어 태도나 행동을 취함." 
    },
];

// Class to represent a single flashcard
class Flashcard {
    constructor(word, meaning, example, relatedWords) {
        this.word = word;
        this.meaning = meaning;
        this.example = example;
        this.relatedWords = relatedWords;
    }

    processLineBreaks(text) {
        return text.replace(/<br\s*\/?>/g, '\n');
    }

    boldWords(text, wordToBold) {
        let formattedText = text;
        const regex = new RegExp(`(${wordToBold})`, 'g');
        formattedText = formattedText.replace(regex, '<span class="bold-word">$1</span>');
        return formattedText;
    }

    processRelatedWords(relatedWords) {
        const relatedWordsArray = relatedWords.split(',').map(item => item.trim());
        let formattedRelatedWords = '';
        relatedWordsArray.forEach(item => {
            const [word, meaning] = item.split(':').map(part => part.trim());
            formattedRelatedWords += `<div><span class="bold-word">${word}</span>: ${meaning}</div>`;
        });
        return formattedRelatedWords;
    }

    createCard() {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('onclick', 'flipCard(this)');

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        const word = document.createElement('h2');
        word.textContent = this.word;
        cardFront.appendChild(word);

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');

        const meaning = document.createElement('h3');
        meaning.textContent = `${this.meaning}`;
        meaning.classList.add('hidden-meaning');

        const example = document.createElement('p');
        example.innerHTML = `<span class="example">예문: </span>${this.boldWords(this.processLineBreaks(this.example), this.word)}`;

        const relatedWords = document.createElement('p');
        relatedWords.innerHTML = `<span class="related-words">Related words: </span>${this.processRelatedWords(this.relatedWords)}`;

        cardBack.appendChild(meaning);
        cardBack.appendChild(example);
        cardBack.appendChild(relatedWords);

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);

        card.appendChild(cardInner);

        // Add Edit Button
        const editButton = document.createElement('button');
        editButton.textContent = "✎";
        editButton.classList.add('edit-btn');
        editButton.setAttribute('onclick', 'editCard(this)');
        cardBack.appendChild(editButton);

        // Add Delete Button (using Font Awesome trash icon)
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.setAttribute('onclick', 'deleteCard(this)');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        cardBack.appendChild(deleteButton);

        return card;
    }
}

// Function to generate all flashcards dynamically
function generateCards() {
    const cardsWrapper = document.getElementById('cardsWrapper');
    cardsWrapper.innerHTML = '';

    vocabulary.forEach(item => {
        const flashcard = new Flashcard(item.word, item.meaning, item.example, item.relatedWords);
        const cardElement = flashcard.createCard();
        cardsWrapper.appendChild(cardElement);
    });
}

// Function to shuffle the cards
function shuffleCards() {
    const cardsWrapper = document.getElementById('cardsWrapper');
    const cards = Array.from(cardsWrapper.children);
    const shuffledCards = shuffleArray(cards);

    cardsWrapper.innerHTML = '';
    shuffledCards.forEach(card => {
        cardsWrapper.appendChild(card);
    });

    cardsWrapper.style.transform = 'scale(1.05)';
    setTimeout(() => {
        cardsWrapper.style.transform = 'scale(1)';
    }, 500);
}

// Shuffle helper function
function shuffleArray(array) {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

// Function to flip a card
function flipCard(card) {
    const cardInner = card.querySelector('.card-inner');
    cardInner.classList.toggle('flipped');
}

// Toggle Add Card Form
function toggleAddForm() {
    const modal = document.getElementById('addCardModal');
    modal.style.display = modal.style.display === 'none' || modal.style.display === '' ? 'flex' : 'none';
}

// Function to add a new vocabulary card
function addNewCard() {
    const newWord = document.getElementById('newWord').value;
    const newMeaning = document.getElementById('newMeaning').value;
    const newExample = document.getElementById('newExample').value;
    const newRelatedWords = document.getElementById('newRelatedWords').value;

    // Check if all inputs are filled
    if (newWord.trim() && newMeaning.trim() && newExample.trim() && newRelatedWords.trim()) {
        // Create a new Flashcard and add it to the vocabulary array
        const newCard = new Flashcard(newWord, newMeaning, newExample, newRelatedWords);
        vocabulary.push({
            word: newWord,
            meaning: newMeaning,
            example: newExample,
            relatedWords: newRelatedWords
        });

        // Save to localStorage
        localStorage.setItem("vocabulary", JSON.stringify(vocabulary));

        // Generate cards again to include the new card
        generateCards();

        // Clear the input fields for the next card
        document.getElementById('newWord').value = '';  // Clear the Word input
        document.getElementById('newMeaning').value = '';  // Clear the Meaning input
        document.getElementById('newExample').value = '';  // Clear the Example input
        document.getElementById('newRelatedWords').value = '';  // Clear the Related Words input

        // Optionally focus on the first input field (Word input) for smoother experience
        document.getElementById('newWord').focus();

        // Close the Add Card modal
        toggleAddForm();
    }
}

// Function to delete a flashcard
function deleteCard(button) {
    const card = button.closest('.card'); // Get the closest card element
    card.remove(); // Remove the card from the DOM

    // Remove from vocabulary array
    const wordToDelete = card.querySelector('.card-front h2').textContent;
    const index = vocabulary.findIndex(item => item.word === wordToDelete);
    if (index > -1) {
        vocabulary.splice(index, 1); // Remove the vocabulary entry
    }

    // Save to localStorage
    localStorage.setItem("vocabulary", JSON.stringify(vocabulary));
}

// Initialize cards
generateCards();
