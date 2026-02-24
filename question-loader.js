// Question Loader - Handles loading questions from JSON files

class QuestionLoader {
    constructor() {
        this.cache = {}; // Cache loaded questions
    }

    /**
     * Load questions from a JSON file
     * @param {string} filePath - Path to the JSON file
     * @returns {Promise<Array>} - Array of questions
     */
    async loadQuestions(filePath) {
        // Check cache first
        if (this.cache[filePath]) {
            console.log(`Loading from cache: ${filePath}`);
            return this.cache[filePath];
        }

        try {
            console.log(`Fetching questions from: ${filePath}`);
            const response = await fetch(filePath);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.status}`);
            }

            const data = await response.json();
            
            // Validate question format
            const questions = this.validateQuestions(data);
            
            // Cache the questions
            this.cache[filePath] = questions;
            
            console.log(`Loaded ${questions.length} questions from ${filePath}`);
            return questions;

        } catch (error) {
            console.error(`Error loading questions from ${filePath}:`, error);
            throw error;
        }
    }

    /**
     * Validate and normalize question format
     * @param {Object|Array} data - Raw data from JSON file
     * @returns {Array} - Validated questions array
     */
    validateQuestions(data) {
        // If data has a 'questions' property, use that
        let questions = Array.isArray(data) ? data : data.questions;

        if (!Array.isArray(questions)) {
            throw new Error('Questions must be an array');
        }

        // Validate each question
        return questions.map((q, index) => {
            if (!q.question || typeof q.question !== 'string') {
                throw new Error(`Question ${index + 1}: Missing or invalid 'question' field`);
            }

            if (!Array.isArray(q.options) || q.options.length !== 4) {
                throw new Error(`Question ${index + 1}: Must have exactly 4 options`);
            }

            if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3) {
                throw new Error(`Question ${index + 1}: 'correct' must be 0, 1, 2, or 3`);
            }

            if (!q.explanation || typeof q.explanation !== 'string') {
                throw new Error(`Question ${index + 1}: Missing or invalid 'explanation' field`);
            }

            return {
                question: q.question,
                options: q.options,
                correct: q.correct,
                explanation: q.explanation
            };
        });
    }

    /**
     * Get random questions from a topic
     * @param {string} filePath - Path to the JSON file
     * @param {number} count - Number of questions to return
     * @returns {Promise<Array>} - Array of random questions
     */
    async getRandomQuestions(filePath, count = 10) {
        const allQuestions = await this.loadQuestions(filePath);
        
        if (allQuestions.length <= count) {
            return this.shuffleArray([...allQuestions]);
        }

        // Shuffle and take first 'count' questions
        const shuffled = this.shuffleArray([...allQuestions]);
        return shuffled.slice(0, count);
    }

    /**
     * Shuffle array using Fisher-Yates algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} - Shuffled array
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache = {};
        console.log('Question cache cleared');
    }
}

// Create global instance
const questionLoader = new QuestionLoader();
