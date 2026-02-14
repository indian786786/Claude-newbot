// ===========================================
// SSC QUIZ ENGINE - TELEGRAM OPTIMIZED V3
// Professional + Smart Preload + Offline Cache
// ===========================================

class SSCQuizApp {

    constructor() {

        this.state = {
            subjectData: null,
            topicQuestions: [],
            currentBatch: [],
            currentQuestionIndex: 0,
            batchNumber: 0,
            correct: 0,
            wrong: 0,
            selectedSubject: null,
            selectedTopic: null,
        };

        this.cache = {}; // In-memory cache

        this.init();
    }

    // ================= INIT =================

    init() {
        this.initTelegram();
        this.attachEvents();
        console.log("SSC Quiz Engine Initialized");
    }

    initTelegram() {
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand();
            tg.disableVerticalSwipes();
            console.log("Telegram optimized mode enabled");
        }
    }

    attachEvents() {
        document.getElementById("startQuizBtn").addEventListener("click", () => this.startQuiz());
        document.getElementById("loadMoreBtn").addEventListener("click", () => this.loadNextBatch());
        document.getElementById("nextQuestionBtn").addEventListener("click", () => this.nextQuestion());
        document.getElementById("restartBtn").addEventListener("click", () => this.resetApp());
    }

    // ================= SUBJECT LOAD =================

    async loadSubject(subjectName) {

        if (this.cache[subjectName]) {
            console.log("Loaded from memory cache");
            return this.cache[subjectName];
        }

        // LocalStorage cache
        const localCache = localStorage.getItem(subjectName);
        if (localCache) {
            console.log("Loaded from localStorage");
            const parsed = JSON.parse(localCache);
            this.cache[subjectName] = parsed;
            return parsed;
        }

        // Fetch from server
        const path = `./questions/${subjectName}.json`;

        const response = await fetch(path);
        if (!response.ok) throw new Error("Failed to load subject file");

        const data = await response.json();

        // Save to cache
        this.cache[subjectName] = data;
        localStorage.setItem(subjectName, JSON.stringify(data));

        console.log("Loaded from server and cached");
        return data;
    }

    // ================= START QUIZ =================

    async startQuiz() {

        const subject = document.getElementById("subjectSelect").value;
        const topic = document.getElementById("topicSelect").value;

        if (!subject || !topic) {
            alert("Select subject and topic");
            return;
        }

        this.state.selectedSubject = subject;
        this.state.selectedTopic = topic;

        document.getElementById("loading").classList.add("show");

        try {

            const subjectData = await this.loadSubject(subject);

            if (!subjectData[topic]) {
                throw new Error("Topic not found in subject file");
            }

            this.state.topicQuestions = this.shuffle(subjectData[topic]);

            this.state.correct = 0;
            this.state.wrong = 0;
            this.state.batchNumber = 0;

            this.loadBatch();

            document.getElementById("selectionSection").classList.add("hidden");
            document.getElementById("quizSection").classList.add("active");

        } catch (err) {
            alert(err.message);
        }

        document.getElementById("loading").classList.remove("show");
    }

    // ================= BATCH SYSTEM =================

    loadBatch() {

        const start = this.state.batchNumber * 5;
        const end = start + 5;

        this.state.currentBatch = this.state.topicQuestions.slice(start, end);
        this.state.currentQuestionIndex = 0;

        this.displayQuestion();
    }

    loadNextBatch() {
        this.state.batchNumber++;
        this.loadBatch();
    }

    // ================= DISPLAY =================

    displayQuestion() {

        if (this.state.currentQuestionIndex >= this.state.currentBatch.length) {
            this.showBatchEnd();
            return;
        }

        const q = this.state.currentBatch[this.state.currentQuestionIndex];

        document.getElementById("questionText").textContent = q.question;

        const container = document.getElementById("optionsContainer");
        container.innerHTML = "";

        q.options.forEach((opt, index) => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.textContent = opt;
            btn.onclick = () => this.handleAnswer(index);
            container.appendChild(btn);
        });

        document.getElementById("explanationBox").classList.remove("show");
    }

    // ================= ANSWER =================

    handleAnswer(index) {

        const q = this.state.currentBatch[this.state.currentQuestionIndex];
        const buttons = document.querySelectorAll(".option-btn");

        buttons.forEach((btn, i) => {
            btn.disabled = true;
            if (i === q.correct) btn.classList.add("correct");
            if (i === index && i !== q.correct) btn.classList.add("wrong");
        });

        if (index === q.correct) this.state.correct++;
        else this.state.wrong++;

        this.showExplanation(q);
    }

    showExplanation(q) {

        document.getElementById("explanationContent").textContent = q.explanation;
        document.getElementById("explanationFact").textContent =
            "Related Concept: Revise this topic for SSC memory retention.";

        document.getElementById("explanationBox").classList.add("show");
    }

    nextQuestion() {
        this.state.currentQuestionIndex++;
        this.displayQuestion();
    }

    showBatchEnd() {
        document.getElementById("paginationActions").style.display = "block";
    }

    // ================= RESET =================

    resetApp() {
        location.reload();
    }

    // ================= UTILITY =================

    shuffle(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }
}

// Init
document.addEventListener("DOMContentLoaded", () => {
    window.quizApp = new SSCQuizApp();
});    // ================= BATCH SYSTEM =================

    loadBatch() {

        const start = this.state.batchNumber * 5;
        const end = start + 5;

        this.state.currentBatch = this.state.topicQuestions.slice(start, end);
        this.state.currentQuestionIndex = 0;

        this.displayQuestion();
    }

    loadNextBatch() {
        this.state.batchNumber++;
        this.loadBatch();
    }

    // ================= DISPLAY =================

    displayQuestion() {

        if (this.state.currentQuestionIndex >= this.state.currentBatch.length) {
            this.showBatchEnd();
            return;
        }

        const q = this.state.currentBatch[this.state.currentQuestionIndex];

        document.getElementById("questionText").textContent = q.question;

        const container = document.getElementById("optionsContainer");
        container.innerHTML = "";

        q.options.forEach((opt, index) => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.textContent = opt;
            btn.onclick = () => this.handleAnswer(index);
            container.appendChild(btn);
        });

        document.getElementById("explanationBox").classList.remove("show");
    }

    // ================= ANSWER =================

    handleAnswer(index) {

        const q = this.state.currentBatch[this.state.currentQuestionIndex];
        const buttons = document.querySelectorAll(".option-btn");

        buttons.forEach((btn, i) => {
            btn.disabled = true;
            if (i === q.correct) btn.classList.add("correct");
            if (i === index && i !== q.correct) btn.classList.add("wrong");
        });

        if (index === q.correct) this.state.correct++;
        else this.state.wrong++;

        this.showExplanation(q);
    }

    showExplanation(q) {

        document.getElementById("explanationContent").textContent = q.explanation;
        document.getElementById("explanationFact").textContent =
            "Related Concept: Revise this topic for SSC memory retention.";

        document.getElementById("explanationBox").classList.add("show");
    }

    nextQuestion() {
        this.state.currentQuestionIndex++;
        this.displayQuestion();
    }

    showBatchEnd() {
        document.getElementById("paginationActions").style.display = "block";
    }

    // ================= RESET =================

    resetApp() {
        location.reload();
    }

    // ================= UTILITY =================

    shuffle(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }
}

// Init
document.addEventListener("DOMContentLoaded", () => {
    window.quizApp = new SSCQuizApp();
});            this.startQuiz();
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
