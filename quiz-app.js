// SSC PYQ Quiz Application - Professional Stable Version

class SSCQuizApp {
    constructor() {
        this.state = {
            allQuestions: [],
            currentBatchQuestions: [],
            currentQuestionIndex: 0,
            currentBatchNumber: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            answered: false,
            selectedSubject: null,
            selectedTopic: null,
            topicFilePath: null
        };

        this.elements = {
            selectionSection: document.getElementById('selectionSection'),
            subjectSelect: document.getElementById('subjectSelect'),
            topicSelect: document.getElementById('topicSelect'),
            startQuizBtn: document.getElementById('startQuizBtn'),
            errorMessage: document.getElementById('errorMessage'),
            loading: document.getElementById('loading'),

            quizSection: document.getElementById('quizSection'),
            questionNumber: document.getElementById('questionNumber'),
            questionText: document.getElementById('questionText'),
            optionsContainer: document.getElementById('optionsContainer'),
            explanationBox: document.getElementById('explanationBox'),
            explanationContent: document.getElementById('explanationContent'),
            nextQuestionBtn: document.getElementById('nextQuestionBtn'),

            resultsSection: document.getElementById('resultsSection'),
            resultsScore: document.getElementById('resultsScore'),
            resultsMessage: document.getElementById('resultsMessage'),
            restartBtn: document.getElementById('restartBtn')
        };

        this.init();
    }

    init() {
        this.initializeTelegram();
        this.populateSubjects();
        this.attachEventListeners();
    }

    initializeTelegram() {
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand();
        }
    }

    populateSubjects() {
        const subjects = getAllSubjects();
        this.elements.subjectSelect.innerHTML = '<option value="">Choose a subject...</option>';

        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.value;
            option.textContent = subject.label;
            this.elements.subjectSelect.appendChild(option);
        });
    }

    attachEventListeners() {
        this.elements.subjectSelect.addEventListener('change', (e) => {
            this.onSubjectChange(e.target.value);
        });

        this.elements.topicSelect.addEventListener('change', (e) => {
            this.onTopicChange(e.target.value);
        });

        this.elements.startQuizBtn.addEventListener('click', () => {
            this.startQuiz();
        });

        this.elements.nextQuestionBtn.addEventListener('click', () => {
            this.nextQuestion();
        });

        this.elements.restartBtn.addEventListener('click', () => {
            this.restartQuiz();
        });
    }

    onSubjectChange(subject) {
        this.state.selectedSubject = subject;
        this.elements.topicSelect.innerHTML = '<option value="">Choose topic...</option>';
        this.elements.startQuizBtn.disabled = true;

        if (!subject) return;

        const topics = getTopicsForSubject(subject);

        topics.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic.value;
            option.textContent = topic.label;
            option.dataset.path = topic.path;
            this.elements.topicSelect.appendChild(option);
        });

        this.elements.topicSelect.disabled = false;
    }

    onTopicChange(topic) {
        if (!topic) return;

        const selectedOption = this.elements.topicSelect.options[this.elements.topicSelect.selectedIndex];
        this.state.topicFilePath = QUESTIONS_BASE_PATH + selectedOption.dataset.path;

        this.elements.startQuizBtn.disabled = false;
    }

    async startQuiz() {
        this.showLoading();

        try {
            const response = await fetch(this.state.topicFilePath);
            if (!response.ok) throw new Error("Failed to load questions");

            const questions = await response.json();
            if (!Array.isArray(questions)) throw new Error("Invalid JSON format");

            this.state.allQuestions = this.shuffleArray(questions);
            this.state.currentBatchQuestions = this.state.allQuestions.slice(0, 5);
            this.state.currentQuestionIndex = 0;
            this.state.correctAnswers = 0;
            this.state.wrongAnswers = 0;

            this.elements.selectionSection.style.display = "none";
            this.elements.quizSection.classList.add("active");

            this.displayQuestion();

        } catch (error) {
            this.showError(error.message);
        }

        this.hideLoading();
    }

    displayQuestion() {
        if (this.state.currentQuestionIndex >= this.state.currentBatchQuestions.length) {
            this.showResults();
            return;
        }

        const question = this.state.currentBatchQuestions[this.state.currentQuestionIndex];
        this.elements.questionNumber.textContent = `Question ${this.state.currentQuestionIndex + 1}`;
        this.elements.questionText.textContent = question.question;

        this.elements.optionsContainer.innerHTML = "";

        question.options.forEach((option, index) => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.textContent = option;
            btn.onclick = () => this.handleAnswer(index);
            this.elements.optionsContainer.appendChild(btn);
        });

        this.elements.explanationBox.style.display = "none";
        this.state.answered = false;
    }

    handleAnswer(selectedIndex) {
        if (this.state.answered) return;

        this.state.answered = true;
        const question = this.state.currentBatchQuestions[this.state.currentQuestionIndex];
        const buttons = this.elements.optionsContainer.querySelectorAll(".option-btn");

        buttons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === question.correct) btn.classList.add("correct");
            if (index === selectedIndex && index !== question.correct) btn.classList.add("wrong");
        });

        if (selectedIndex === question.correct) {
            this.state.correctAnswers++;
        } else {
            this.state.wrongAnswers++;
        }

        this.elements.explanationContent.textContent = question.explanation;
        this.elements.explanationBox.style.display = "block";
    }

    nextQuestion() {
        this.state.currentQuestionIndex++;
        this.displayQuestion();
    }

    showResults() {
        this.elements.quizSection.classList.remove("active");
        this.elements.resultsSection.classList.add("active");

        const total = this.state.currentBatchQuestions.length;
        const score = this.state.correctAnswers;
        const percentage = Math.round((score / total) * 100);

        this.elements.resultsScore.textContent = `${score}/${total}`;
        this.elements.resultsMessage.textContent = `You scored ${percentage}%`;
    }

    restartQuiz() {
        this.elements.resultsSection.classList.remove("active");
        this.elements.selectionSection.style.display = "block";
        this.elements.subjectSelect.value = "";
        this.elements.topicSelect.innerHTML = '<option value="">Select subject first...</option>';
        this.elements.topicSelect.disabled = true;
        this.elements.startQuizBtn.disabled = true;
    }

    shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.style.display = "block";
    }

    showLoading() {
        this.elements.loading.style.display = "block";
        this.elements.startQuizBtn.disabled = true;
    }

    hideLoading() {
        this.elements.loading.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new SSCQuizApp();
});
