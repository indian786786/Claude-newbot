// Configuration for SSC PYQ Quiz
// Define all categories and their topics

const quizConfig = {
    categories: {
        "Polity": {
            icon: "⚖️",
            topics: [
                {
                    name: "Central Government",
                    file: "questions/Polity/Central_Government.json",
                    questionsCount: 10
                },
                {
                    name: "Indian Constitution",
                    file: "questions/Polity/Indian_Constitution.json",
                    questionsCount: 10
                },
                {
                    name: "Fundamental Rights",
                    file: "questions/Polity/Fundamental_Rights.json",
                    questionsCount: 10
                }
            ]
        },
        "History": {
            icon: "🏛️",
            topics: [
                {
                    name: "Lodi Dynasty",
                    file: "questions/History/Lodi_Dynasty.json",
                    questionsCount: 10
                },
                {
                    name: "Mughal Empire",
                    file: "questions/History/Mughal_Empire.json",
                    questionsCount: 10
                },
                {
                    name: "Independence Movement",
                    file: "questions/History/Independence_Movement.json",
                    questionsCount: 10
                }
            ]
        },
        "Geography": {
            icon: "🌍",
            topics: [
                {
                    name: "Indian Rivers",
                    file: "questions/Geography/Indian_Rivers.json",
                    questionsCount: 10
                },
                {
                    name: "World Geography",
                    file: "questions/Geography/World_Geography.json",
                    questionsCount: 10
                }
            ]
        },
        "Mathematics": {
            icon: "🔢",
            topics: [
                {
                    name: "Ratio & Proportion",
                    file: "questions/Mathematics/Ratio_Proportion.json",
                    questionsCount: 10
                },
                {
                    name: "Algebra",
                    file: "questions/Mathematics/Algebra.json",
                    questionsCount: 10
                }
            ]
        },
        "Science": {
            icon: "🔬",
            topics: [
                {
                    name: "Physics",
                    file: "questions/Science/Physics.json",
                    questionsCount: 10
                },
                {
                    name: "Chemistry",
                    file: "questions/Science/Chemistry.json",
                    questionsCount: 10
                },
                {
                    name: "Biology",
                    file: "questions/Science/Biology.json",
                    questionsCount: 10
                }
            ]
        },
        "Economics": {
            icon: "💰",
            topics: [
                {
                    name: "Indian Economy",
                    file: "questions/Economics/Indian_Economy.json",
                    questionsCount: 10
                },
                {
                    name: "Banking",
                    file: "questions/Economics/Banking.json",
                    questionsCount: 10
                }
            ]
        }
    },
    
    // Quiz settings
    settings: {
        questionsPerQuiz: 10,
        timeLimit: 600, // 10 minutes in seconds
        marksPerQuestion: 2,
        negativeMar

ks: 0.25
    }
};
