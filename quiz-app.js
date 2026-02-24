// Main Quiz Application Logic

class QuizApp {
    constructor() {
        this.currentCategory = null;
        this.currentTopic = null;
        this.questions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.wrongCount = 0;
        this.selectedAnswer = null;
        this.answered = false;
        this.markedQuestions = [];
        this.timeLeft = quizConfig.settings.timeLimit;
        this.timerInterval = null;
        
        this.initElements();
        this.initTelegram();
        this.loadCategories();
        this.attachEventListeners();
    }

    initElements() {
        // Screens
        this.categoryScreen = document.getElementById('categoryScreen');
        this.topicScreen = document.getElementById('topicScreen');
        this.quizScreen = document.getElementById('quizScreen');
        this.resultsScreen = document.getElementById('resultsScreen');

        // Category screen
        this.categoriesGrid = document.getElementById('categoriesGrid');

        // Topic screen
        this.categoryTitle = document.getElementById('categoryTitle');
        this.topicsList = document.getElementById('topicsList');
        this.backBtn = document.getElementById('backToCategories');

        // Quiz screen
        this.quizTopicTitle = document.getElementById('quizTopicTitle');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.questionNum = document.getElementById('questionNum');
        this.questionText = document.getElementById('questionText');
        this.optionsList = document.getElementById('optionsList');
        this.explanationBox = document.getElementById('explanationBox');
        this.explanationText = document.getElementById('explanationText');
        this.lastMinutes = document.getElementById('lastMinutes');
        
        // Buttons
        this.markBtn = document.getElementById('markBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.submitBtn = document.getElementById('submitBtn');

        // Results screen
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.resultsMessage = document.getElementById('resultsMessage');
        this.correctCount = document.getElementById('correctCount');
        this.wrongCount = document.getElementById('wrongCount');
        this.percentageScore = document.getElementById('percentageScore');
        this.restartBtn = document.getElementById('restartBtn');
    }

    initTelegram() {
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand();
        }
    }

    loadCategories() {
        this.categoriesGrid.innerHTML = '';
        
        Object.entries(quizConfig.categories).forEach(([categoryName, categoryData]) => {
            const topicsCount = categoryData.topics.length;
            
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-icon">${categoryData.icon}</div>
                <div class="category-name">${categoryName}</div>
                <div class="category-count">${topicsCount} Topics</div>
            `;
            
            card.onclick = () => this.selectCategory(categoryName);
            this.categoriesGrid.appendChild(card);
        });
    }

    selectCategory(categoryName) {
        this.currentCategory = categoryName;
        const categoryData = quizConfig.categories[categoryName];
        
        this.categoryTitle.textContent = `${categoryData.icon} ${categoryName}`;
        this.topicsList.innerHTML = '';
        
        categoryData.topics.forEach(topic => {
            const card = document.createElement('div');
            card.className = 'topic-card';
            card.innerHTML = `
                <div class="topic-info">
                    <h3>${topic.name}</h3>
                    <p>${topic.questionsCount} Questions</p>
                </div>
                <div class="topic-arrow">→</div>
            `;
            
            card.onclick = () => this.startQuiz(topic);
            this.topicsList.appendChild(card);
        });
        
        this.categoryScreen.style.display = 'none';
        this.topicScreen.classList.add('active');
    }

    async startQuiz(topic) {
        try {
            this.currentTopic = topic;
            this.quizTopicTitle.textContent = topic.name;
            
            // Load questions
            this.questions = await questionLoader.getRandomQuestions(
                topic.file, 
                quizConfig.settings.questionsPerQuiz
            );
            
            // Reset quiz state
            this.currentIndex = 0;
            this.score = 0;
            this.wrongCount = 0;
            this.markedQuestions = [];
            this.timeLeft = quizConfig.settings.timeLimit;
            
            // Show quiz screen
            this.topicScreen.classList.remove('active');
            this.quizScreen.classList.add('active');
            
            // Start timer and display first question
            this.startTimer();
            this.displayQuestion();
            
        } catch (error) {
            alert(`Error loading quiz: ${error.message}`);
            console.error(error);
        }
    }

    startTimer() {
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.showResults();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        this.lastMinutes.textContent = String(minutes).padStart(2, '0');
    }

    displayQuestion() {
        const q = this.questions[this.currentIndex];
        this.selectedAnswer = null;
        this.answered = false;

        this.questionNum.textContent = `Question No.: ${this.currentIndex + 1}`;
        this.questionText.textContent = q.question;
        
        this.explanationBox.classList.remove('show');
        this.optionsList.innerHTML = '';
        this.nextBtn.textContent = 'Save & Next';

        q.options.forEach((option, index) => {
            const div = document.createElement('div');
            div.className = 'option-item';
            div.innerHTML = `
                <div class="option-radio"></div>
                <div class="option-text">${option}</div>
            `;
            div.onclick = () => this.selectOption(index, div);
            this.optionsList.appendChild(div);
        });
    }

    selectOption(index, element) {
        if (this.answered) return;

        this.selectedAnswer = index;
        
        document.querySelectorAll('.option-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        element.classList.add('selected');
    }

    markForReview() {
        if (!this.markedQuestions.includes(this.currentIndex)) {
            this.markedQuestions.push(this.currentIndex);
        }
        alert('Question marked for review!');
    }

    nextQuestion() {
        if (this.selectedAnswer === null) {
            alert('Please select an answer');
            return;
        }

        if (!this.answered) {
            this.checkAnswer();
        } else {
            this.moveToNext();
        }
    }

    checkAnswer() {
        this.answered = true;
        const q = this.questions[this.currentIndex];
        const options = document.querySelectorAll('.option-item');

        options.forEach((opt, idx) => {
            opt.classList.add('disabled');
            
            if (idx === q.correct) {
                opt.classList.add('correct');
            }
            
            if (idx === this.selectedAnswer && idx !== q.correct) {
                opt.classList.add('wrong');
            }
        });

        if (this.selectedAnswer === q.correct) {
            this.score++;
        } else {
            this.wrongCount++;
        }

        this.explanationText.textContent = q.explanation;
        this.explanationBox.classList.add('show');
        this.nextBtn.textContent = 'Next Question →';
    }

    moveToNext() {
        this.currentIndex++;
        
        if (this.currentIndex >= this.questions.length) {
            clearInterval(this.timerInterval);
            this.showResults();
        } else {
            this.displayQuestion();
        }
    }

    submitTest() {
        if (confirm('Are you sure you want to submit the test?')) {
            clearInterval(this.timerInterval);
            this.showResults();
        }
    }

    showResults() {
        this.quizScreen.classList.remove('active');
        this.resultsScreen.classList.add('active');

        const totalQuestions = this.questions.length;
        const percentage = Math.round((this.score / totalQuestions) * 100);

        this.scoreDisplay.textContent = `${this.score}/${totalQuestions}`;
        this.correctCount.textContent = this.score;
        this.wrongCount.textContent = this.wrongCount;
        this.percentageScore.textContent = `${percentage}%`;
        
        let message = '';
        if (percentage >= 80) {
            message = '🌟 Excellent! You\'re well prepared!';
        } else if (percentage >= 60) {
            message = '👍 Good job! Keep practicing!';
        } else if (percentage >= 40) {
            message = '📖 Not bad! More practice needed.';
        } else {
            message = '💪 Keep learning! You\'ll improve!';
        }

        this.resultsMessage.textContent = message;
    }

    restart() {
        this.resultsScreen.classList.remove('active');
        this.categoryScreen.style.display = 'block';
        this.loadCategories();
    }

    attachEventListeners() {
        this.backBtn.onclick = () => {
            this.topicScreen.classList.remove('active');
            this.categoryScreen.style.display = 'block';
        };

        this.markBtn.onclick = () => this.markForReview();
        this.nextBtn.onclick = () => this.nextQuestion();
        this.submitBtn.onclick = () => this.submitTest();
        this.restartBtn.onclick = () => this.restart();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.quizApp = new QuizApp();
});
