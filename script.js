class TriviaGame {
    constructor() {
        this.players = [];
        this.difficulty = '';
        this.category = '';
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.currentPlayerIndex = 0;
        this.scores = [0, 0];
        this.setupEventListeners();
    }

    
    setupEventListeners() {
        document.getElementById('start-game-btn').addEventListener('click', this.initializePlayers.bind(this));
        document.getElementById('next-category-btn').addEventListener('click', this.selectCategory.bind(this));
        document.getElementById('start-difficulty-btn').addEventListener('click', this.selectDifficulty.bind(this));
        document.getElementById('restart-game-btn').addEventListener('click', this.restartGame.bind(this));
    }

   
    initializePlayers() {
        const player1 = document.getElementById('player1-name').value.trim();
        const player2 = document.getElementById('player2-name').value.trim();

        if (player1 && player2) {
            this.players = [player1, player2];
            this.showSection('game-setup', 'category-selection');
        } else {
            alert('Please enter names for both players!');
        }
    }

    selectCategory() {
        this.category = document.getElementById('category-list').value;
        this.showSection('category-selection', 'difficulty-selection');
    }

 
    async selectDifficulty() {
        this.difficulty = document.getElementById('difficulty-list').value;
        this.questions = await this.fetchQuestions(this.category, this.difficulty);
        this.showSection('difficulty-selection', 'trivia-game');
        this.startGame();
    }


    async fetchQuestions(category, difficulty) {
        const url = `https://opentdb.com/api.php?amount=6&category=${category}&difficulty=${difficulty}&type=multiple`;
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    }

  
    startGame() {
        this.currentQuestionIndex = 0;
        this.currentPlayerIndex = 0;
        this.askQuestion();
    }
    askQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        document.getElementById('current-player-name').innerText = `${this.players[this.currentPlayerIndex]}'s Turn 🤔`;
        document.getElementById('trivia-question').innerText = this.decodeHTML(question.question);

        const options = document.querySelectorAll('.answer-option');
        const answers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.3);
        options.forEach((btn, i) => {
            btn.innerText = this.decodeHTML(answers[i]);
            btn.onclick = () => this.handleAnswer(btn.innerText, question.correct_answer);
        });
    }


    handleAnswer(selected, correct) {
        const feedback = document.createElement('p');
        feedback.style.fontSize = '1.5rem';
        feedback.style.color = selected === correct ? 'green' : 'red';
        feedback.innerText = selected === correct ? '✅ Correct Answer!' : '❌ Incorrect Answer!';
        document.getElementById('trivia-game').appendChild(feedback);

        if (selected === correct) {
            this.scores[this.currentPlayerIndex]++;
        }

        setTimeout(() => {
            feedback.remove(); 
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
            this.currentQuestionIndex++;

            this.currentQuestionIndex < this.questions.length ? this.askQuestion() : this.endGame();
        }, 2000);
    }

  
    endGame() {
        this.showSection('trivia-game', 'game-result');
        const winner = this.scores[0] > this.scores[1] ? this.players[0] : this.players[1];
        const winnerEmoji = this.scores[0] === this.scores[1] ? '🤝' : '🏆';

        document.getElementById('final-scores').innerText = `${this.players[0]}: ${this.scores[0]} points 🎉\n${this.players[1]}: ${this.scores[1]} points 🎉\n\n🏅 Winner: ${winner} ${winnerEmoji}`;
    }

    showSection(current, next) {
        document.getElementById(current).classList.add('inv');
        document.getElementById(next).classList.remove('inv');
    }

 
    decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    restartGame() {
        window.location.reload();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TriviaGame();
});
