// SSC PYQ Quiz Application - Main Logic
// Professional implementation with pagination, offline loading, and clean architecture

class SSCQuizApp {
    constructor() {
        // State management
        this.state = {
            allQuestions: [],           // All 50 questions from JSON
            currentBatchQuestions: [],  // Current 5 questions being displayed
            currentQuestionIndex: 0,    // Index within current batch (0-4)
            currentBatchNumber: 0,      // Which batch of 5 (0-9 for 50 questions)
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            answered: false,
            selectedSubject: null,
            selectedTopic: null,
            topicFilePath: null
        };

        // DOM elements
        this.elements = {
            // Selection section
            selectionSection: document.getElementById('selectionSection'),
            subjectSelect: document.getElementById('subjectSelect'),
            topicSelect: document.getElementById('topicSelect'),
            startQuizBtn: document.getElementById('startQuizBtn'),
            errorMessage: document.getElementById('errorMessage'),
            loading: document.getElementById('loading'),

            // Quiz section
            quizSection: document.getElementById('quizSection'),
            quizProgress: document.getElementById('quizProgress'),
            quizScore: document.getElementById('quizScore'),
            questionNumber: document.getElementById('questionNumber'),
            questionText: document.getElementById('questionText'),
            optionsContainer: document.getElementById('optionsContainer'),
            explanationBox: document.getElementById('explanationBox'),
            explanationContent: document.getElementById('explanationContent'),
            explanationFact: document.getElementById('explanationFact'),
            quizActions: document.getElementById('quizActions'),
            nextQuestionBtn: document.getElementById('nextQuestionBtn'),
            paginationInfo: document.getElementById('paginationInfo'),
            paginationActions: document.getElementById('paginationActions'),
            loadMoreBtn: document.getElementById('loadMoreBtn'),

            // Results section
            resultsSection: document.getElementById('resultsSection'),
            resultsIcon: document.getElementById('resultsIcon'),
            resultsScore: document.getElementById('resultsScore'),
            resultsMessage: document.getElementById('resultsMessage'),
            statCorrect: document.getElementById('statCorrect'),
            statWrong: document.getElementById('statWrong'),
            statPercentage: document.getElementById('statPercentage'),
            restartBtn: document.getElementById('restartBtn')
        };

        this.init();
    }

    init() {
        this.initializeTelegram();
        this.populateSubjects();
        this.attachEventListeners();
        console.log('[INIT] SSC Quiz App initialized');
    }

    initializeTelegram() {
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand();
            console.log('[TELEGRAM] WebApp initialized');
        }
    }

    populateSubjects() {
        const subjects = getAllSubjects();
        
        // Clear existing options except first
        this.elements.subjectSelect.innerHTML = '<option value="">Choose a subject...</option>';
        
        // Add all subjects
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.value;
            option.textContent = subject.label;
            this.elements.subjectSelect.appendChild(option);
        });

        console.log(`[SUBJECTS] Loaded ${subjects.length} subjects`);
    }

    attachEventListeners() {
        // Subject selection
        this.elements.subjectSelect.addEventListener('change', (e) => {
            this.onSubjectChange(e.target.value);
        });

        // Topic selection
        this.elements.topicSelect.addEventListener('change', (e) => {
            this.onTopicChange(e.target.value);
        });

        // Start quiz
        this.elements.startQuizBtn.addEventListener('click', () => {
            this.startQuiz();
        });

        // Next question
        this.elements.nextQuestionBtn.addEventListener('click', () => {
            this.nextQuestion();
        });

        // Load more questions
        this.elements.loadMoreBtn.addEventListener('click', () => {
            this.loadNextBatch();
        });

        // Restart quiz
        this.elements.restartBtn.addEventListener('click', () => {
            this.restartQuiz();
        });
    }

    onSubjectChange(subject) {
        console.log(`[SUBJECT] Selected: ${subject}`);
        
        this.state.selectedSubject = subject;
        this.state.selectedTopic = null;
        
        // Reset topic select
        this.elements.topicSelect.innerHTML = '<option value="">Choose a topic...</option>';
        this.elements.topicSelect.disabled = true;
        this.elements.startQuizBtn.disabled = true;

        if (!subject) {
            this.elements.topicSelect.innerHTML = '<option value="">Select subject first...</option>';
            return;
        }

        // Get topics for selected subject
        const topics = getTopicsForSubject(subject);
        
        if (topics.length === 0) {
            this.showError('No topics available for this subject');
            return;
        }

        // Populate topic dropdown
        topics.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic.value;
            option.textContent = topic.label;
            option.dataset.path = topic.path;
            this.elements.topicSelect.appendChild(option);
        });

        this.elements.topicSelect.disabled = false;
        console.log(`[TOPICS] Loaded ${topics.length} topics for ${subject}`);
    }

    onTopicChange(topic) {
        console.log(`[TOPIC] Selected: ${topic}`);
        
        this.state.selectedTopic = topic;
        
        if (!topic) {
            this.elements.startQuizBtn.disabled = true;
            return;
        }

        // Get file path for selected topic
        const selectedOption = this.elements.topicSelect.options[this.elements.topicSelect.selectedIndex];
        this.state.topicFilePath = QUESTIONS_BASE_PATH + selectedOption.dataset.path;
        
        this.elements.startQuizBtn.disabled = false;
        this.hideError();
        
        console.log(`[PATH] File path: ${this.state.topicFilePath}`);
    }

    async startQuiz() {
        console.log('[START] Loading questions...');
        
        this.showLoading();
        this.hideError();

        try {
            // Load all questions from JSON file
            const questions = await this.loadQuestions(this.state.topicFilePath);
            
            if (!questions || questions.length === 0) {
                throw new Error('No questions found in the selected topic');
            }

            // Shuffle questions for variety
            this.state.allQuestions = this.shuffleArray([...questions]);
            
            // Load first batch (5 questions)
            this.state.currentBatchNumber = 0;
            this.loadBatch(0);
            
            // Reset quiz state
            this.state.currentQuestionIndex = 0;
            this.state.score = 0;
            this.state.correctAnswers = 0;
            this.state.wrongAnswers = 0;
            this.state.answered = false;

            // Show quiz section
            this.hideLoading();
            this.elements.selectionSection.classList.add('hidden');
            this.elements.quizSection.classList.add('active');
            
            // Display first question
            this.displayQuestion();
            this.updatePaginationInfo();

            console.log(`[SUCCESS] Loaded ${questions.length} total questions, showing first 5`);

        } catch (error) {
            console.error('[ERROR]', error);
            this.hideLoading();
            this.showError(error.message || 'Failed to load questions. Please try again.');
        }
    }

    async loadQuestions(filePath) {
        console.log(`[LOAD] Fetching questions from: ${filePath}`);
        
        const response = await fetch(filePath);
        
        if (!response.ok) {
            throw new Error(`Failed to load questions (${response.status})`);
        }

        const data = await response.json();
        
        // Validate question structure
        if (!Array.isArray(data)) {
            throw new Error('Invalid question format');
        }

        // Validate each question has required fields
        data.forEach((q, index) => {
            if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) {
                throw new Error(`Invalid question structure at index ${index}`);
            }
            if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3) {
                throw new Error(`Invalid correct answer at index ${index}`);
            }
            if (!q.explanation) {
                throw new Error(`Missing explanation at index ${index}`);
            }
        });

        return data;
    }

    loadBatch(batchNumber) {
        const startIndex = batchNumber * 5;
        const endIndex = Math.min(startIndex + 5, this.state.allQuestions.length);
        
        this.state.currentBatchQuestions = this.state.allQuestions.slice(startIndex, endIndex);
        this.state.currentBatchNumber = batchNumber;
        
        console.log(`[BATCH] Loaded batch ${batchNumber}: questions ${startIndex + 1}-${endIndex}`);
    }

    loadNextBatch() {
        const nextBatchNumber = this.state.currentBatchNumber + 1;
        const nextBatchStart = nextBatchNumber * 5;
        
        if (nextBatchStart >= this.state.allQuestions.length) {
            this.showError('No more questions available!');
            return;
        }

        // Load next batch
        this.loadBatch(nextBatchNumber);
        this.state.currentQuestionIndex = 0;
        this.state.answered = false;
        
        // Display first question of new batch
        this.displayQuestion();
        this.updatePaginationInfo();
        
        console.log(`[NEXT BATCH] Loaded batch ${nextBatchNumber}`);
    }

    displayQuestion() {
        if (this.state.currentQuestionIndex >= this.state.currentBatchQuestions.length) {
            this.showBatchCompleted();
            return;
        }

        const question = this.state.currentBatchQuestions[this.state.currentQuestionIndex];
        const overallQuestionNumber = (this.state.currentBatchNumber * 5) + this.state.currentQuestionIndex + 1;
        
        // Update question display
        this.elements.questionNumber.textContent = `Question ${overallQuestionNumber}`;
        this.elements.questionText.textContent = question.question;
        
        // Update progress
        const currentBatchSize = this.state.currentBatchQuestions.length;
        this.elements.quizProgress.textContent = `Question ${this.state.currentQuestionIndex + 1} of ${currentBatchSize}`;
        this.elements.quizScore.textContent = `Score: ${this.state.correctAnswers}/${(this.state.currentBatchNumber * 5) + this.state.currentQuestionIndex}`;
        
        // Clear and populate options
        this.elements.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.onclick = () => this.handleAnswer(index);
            this.elements.optionsContainer.appendChild(button);
        });

        // Hide explanation and actions
        this.elements.explanationBox.classList.remove('show');
        this.elements.quizActions.classList.remove('show');
        this.state.answered = false;

        console.log(`[DISPLAY] Question ${overallQuestionNumber}: ${question.question.substring(0, 50)}...`);
    }

    handleAnswer(selectedIndex) {
        if (this.state.answered) return;

        this.state.answered = true;
        const question = this.state.currentBatchQuestions[this.state.currentQuestionIndex];
        const buttons = this.elements.optionsContainer.querySelectorAll('.option-btn');
        const isCorrect = selectedIndex === question.correct;

        // Update score
        if (isCorrect) {
            this.state.correctAnswers++;
            this.state.score++;
        } else {
            this.state.wrongAnswers++;
        }

        // Update UI
        buttons.forEach((btn, index) => {
            btn.disabled = true;
            
            if (index === question.correct) {
                btn.classList.add('correct');
            }
            
            if (index === selectedIndex && !isCorrect) {
                btn.classList.add('wrong');
            }
        });

        // Show explanation
        this.showExplanation(question, isCorrect);
        
        // Show next button
        this.elements.quizActions.classList.add('show');
        
        // Update score display
        const totalAttempted = (this.state.currentBatchNumber * 5) + this.state.currentQuestionIndex + 1;
        this.elements.quizScore.textContent = `Score: ${this.state.correctAnswers}/${totalAttempted}`;

        console.log(`[ANSWER] ${isCorrect ? 'Correct' : 'Wrong'} - Score: ${this.state.correctAnswers}/${totalAttempted}`);
    }

    showExplanation(question, isCorrect) {
        // Main explanation
        this.elements.explanationContent.textContent = question.explanation;
        
        // Generate related fact (you can customize this based on question data)
        const fact = this.generateRelatedFact(question, isCorrect);
        this.elements.explanationFact.textContent = fact;
        
        // Show explanation box with animation
        this.elements.explanationBox.classList.add('show');
    }

    generateRelatedFact(question, isCorrect) {
        // This is a simple implementation
        // In production, you can add 'relatedFact' field to your JSON
        // or generate context-aware facts
        
        if (isCorrect) {
            return `Great job! The correct answer is: ${question.options[question.correct]}`;
        } else {
            return `Remember: ${question.options[question.correct]} is the correct answer. Review this concept for better retention.`;
        }
    }

    nextQuestion() {
        this.state.currentQuestionIndex++;
        
        if (this.state.currentQuestionIndex >= this.state.currentBatchQuestions.length) {
            this.showBatchCompleted();
        } else {
            this.displayQuestion();
        }
    }

    showBatchCompleted() {
        const totalAttempted = (this.state.currentBatchNumber + 1) * 5;
        const hasMoreQuestions = totalAttempted < this.state.allQuestions.length;
        
        if (hasMoreQuestions) {
            // Show option to load next batch
            this.elements.paginationActions.style.display = 'block';
            this.elements.loadMoreBtn.textContent = `Load Next 5 Questions (${totalAttempted + 1}-${Math.min(totalAttempted + 5, this.state.allQuestions.length)})`;
        } else {
            // All questions completed - show final results
            this.showResults();
        }
    }

    updatePaginationInfo() {
        const startQuestion = (this.state.currentBatchNumber * 5) + 1;
        const endQuestion = Math.min((this.state.currentBatchNumber + 1) * 5, this.state.allQuestions.length);
        const totalQuestions = this.state.allQuestions.length;
        
        this.elements.paginationInfo.textContent = `Showing questions ${startQuestion}-${endQuestion} of ${totalQuestions}`;
        
        // Hide load more button if no more questions
        if (endQuestion >= totalQuestions) {
            this.elements.paginationActions.style.display = 'none';
        } else {
            this.elements.paginationActions.style.display = 'block';
        }
    }

    showResults() {
        this.elements.quizSection.classList.remove('active');
        this.elements.resultsSection.classList.add('active');

        const totalQuestions = (this.state.currentBatchNumber + 1) * 5;
        const percentage = Math.round((this.state.correctAnswers / totalQuestions) * 100);

        // Update results
        this.elements.resultsScore.textContent = `${this.state.correctAnswers}/${totalQuestions}`;
        this.elements.statCorrect.textContent = this.state.correctAnswers;
        this.elements.statWrong.textContent = this.state.wrongAnswers;
        this.elements.statPercentage.textContent = `${percentage}%`;

        // Set message and icon based on performance
        let message, icon;
        if (percentage >= 90) {
            message = '🌟 Outstanding! You\'re exam ready!';
            icon = '🏆';
        } else if (percentage >= 75) {
            message = '🎯 Excellent work! Keep it up!';
            icon = '🎉';
        } else if (percentage >= 60) {
            message = '👍 Good job! Practice more to improve.';
            icon = '😊';
        } else if (percentage >= 40) {
            message = '📚 Keep practicing! You\'re improving.';
            icon = '💪';
        } else {
            message = '🔥 Don\'t give up! Review and try again.';
            icon = '📖';
        }

        this.elements.resultsMessage.textContent = message;
        this.elements.resultsIcon.textContent = icon;

        console.log(`[RESULTS] Score: ${this.state.correctAnswers}/${totalQuestions} (${percentage}%)`);
    }

    restartQuiz() {
        // Reset state
        this.state = {
            allQuestions: [],
            currentBatchQuestions: [],
            currentQuestionIndex: 0,
            currentBatchNumber: 0,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            answered: false,
            selectedSubject: this.state.selectedSubject,
            selectedTopic: this.state.selectedTopic,
            topicFilePath: this.state.topicFilePath
        };

        // Reset UI
        this.elements.resultsSection.classList.remove('active');
        this.elements.quizSection.classList.remove('active');
        this.elements.selectionSection.classList.remove('hidden');
        
        // Reset selections
        this.elements.subjectSelect.value = '';
        this.elements.topicSelect.innerHTML = '<option value="">Select subject first...</option>';
        this.elements.topicSelect.disabled = true;
        this.elements.startQuizBtn.disabled = true;

        console.log('[RESTART] Quiz reset');
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.classList.add('show');
    }

    hideError() {
        this.elements.errorMessage.classList.remove('show');
    }

    showLoading() {
        this.elements.loading.classList.add('show');
        this.elements.startQuizBtn.disabled = true;
    }

    hideLoading() {
        this.elements.loading.classList.remove('show');
        this.elements.startQuizBtn.disabled = false;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('[APP] Initializing SSC Quiz App...');
    window.quizApp = new SSCQuizApp();
});
