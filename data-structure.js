// Subject-Topic Data Structure
// Maps subjects to their topics with corresponding JSON file paths

const SUBJECT_TOPICS = {
    "Art & Culture": {
        displayName: "🎨 Art & Culture",
        topics: {
            "Architecture": "Art_Culture/Architecture.json",
            "Dances": "Art_Culture/Dances.json",
            "Music": "Art_Culture/Music.json",
            "Fairs and Festivals": "Art_Culture/Fairs_and_Festivals.json",
            "Language and Literature": "Art_Culture/Language_and_Literature.json",
            "Paintings": "Art_Culture/Paintings.json",
            "Indian Sculpture and Different Schools of Art": "Art_Culture/Indian_Sculpture.json",
            "Theatre and Puppetry": "Art_Culture/Theatre_and_Puppetry.json",
            "Philosophy": "Art_Culture/Philosophy.json"
        }
    },
    "Ancient History": {
        displayName: "🏛 Ancient History",
        topics: {
            "Prehistoric Period": "Ancient_History/Prehistoric_Period.json",
            "Indus Valley Civilization": "Ancient_History/Indus_Valley_Civilization.json",
            "Vedic Age": "Ancient_History/Vedic_Age.json",
            "Buddhism": "Ancient_History/Buddhism.json",
            "Jainism": "Ancient_History/Jainism.json",
            "Mahajanapadas & Rise of Magadh": "Ancient_History/Mahajanapadas.json",
            "Mauryan Empire": "Ancient_History/Mauryan_Empire.json",
            "Post Mauryan Age": "Ancient_History/Post_Mauryan_Age.json",
            "Gupta Age": "Ancient_History/Gupta_Age.json",
            "Post Gupta Age": "Ancient_History/Post_Gupta_Age.json",
            "Sangam Age": "Ancient_History/Sangam_Age.json",
            "Travellers in Ancient India": "Ancient_History/Travellers_Ancient_India.json",
            "Books and Authors of Ancient India": "Ancient_History/Books_Authors_Ancient_India.json"
        }
    },
    "Medieval History": {
        displayName: "⚔ Medieval History",
        topics: {
            "Delhi Sultanate": "Medieval_History/Delhi_Sultanate.json",
            "Mughal Empire": "Medieval_History/Mughal_Empire.json",
            "Later Mughals": "Medieval_History/Later_Mughals.json",
            "Maratha Empire": "Medieval_History/Maratha_Empire.json",
            "Regional Kingdoms": "Medieval_History/Regional_Kingdoms.json",
            "Southern Dynasties": "Medieval_History/Southern_Dynasties.json",
            "Bhakti Movement and Saints": "Medieval_History/Bhakti_Movement.json",
            "Travellers of Medieval India": "Medieval_History/Travellers_Medieval_India.json",
            "Turkish Conquest": "Medieval_History/Turkish_Conquest.json",
            "Books and Authors of Medieval India": "Medieval_History/Books_Authors_Medieval_India.json"
        }
    },
    "Modern History": {
        displayName: "🇮🇳 Modern History",
        topics: {
            "Advent of Europeans": "Modern_History/Advent_of_Europeans.json",
            "East India Company Expansion": "Modern_History/EIC_Expansion.json",
            "Important Lists & Chronologies": "Modern_History/Important_Lists.json",
            "Revolt of 1857": "Modern_History/Revolt_1857.json",
            "Congress Sessions": "Modern_History/Congress_Sessions.json",
            "National Movement (1885–1919)": "Modern_History/National_Movement_1885_1919.json",
            "National Movement (1919–1939)": "Modern_History/National_Movement_1919_1939.json",
            "Freedom to Partition (1939–1947)": "Modern_History/Freedom_to_Partition.json",
            "Other Important Movements": "Modern_History/Other_Movements.json",
            "Socio-Religious Reform Movements": "Modern_History/Socio_Religious_Movements.json",
            "Post Independence Events": "Modern_History/Post_Independence.json",
            "World History": "Modern_History/World_History.json"
        }
    },
    "Polity": {
        displayName: "📜 Polity",
        topics: {
            "Important Parts & Schedules": "Polity/Parts_Schedules.json",
            "Important Articles": "Polity/Important_Articles.json",
            "Important Acts": "Polity/Important_Acts.json",
            "Important Amendments": "Polity/Important_Amendments.json",
            "Making of the Constitution": "Polity/Making_Constitution.json",
            "Fundamental Rights": "Polity/Fundamental_Rights.json",
            "DPSP": "Polity/DPSP.json",
            "Fundamental Duties": "Polity/Fundamental_Duties.json",
            "President of India": "Polity/President.json",
            "Parliament": "Polity/Parliament.json",
            "Central Government": "Polity/Central_Government.json",
            "Judiciary": "Polity/Judiciary.json",
            "Governor": "Polity/Governor.json",
            "State Legislature": "Polity/State_Legislature.json",
            "State Government": "Polity/State_Government.json",
            "Local Government": "Polity/Local_Government.json",
            "Constitutional Bodies": "Polity/Constitutional_Bodies.json",
            "Non-Constitutional Bodies": "Polity/Non_Constitutional_Bodies.json",
            "Political Dimensions": "Polity/Political_Dimensions.json"
        }
    },
    "Geography": {
        displayName: "🌍 Geography",
        topics: {
            "Mapping": "Geography/Mapping.json",
            "Mapping & Location (World)": "Geography/Mapping_World.json",
            "Mapping & Location (India)": "Geography/Mapping_India.json",
            "World Geography": "Geography/World_Geography.json",
            "Earth & Universe": "Geography/Earth_Universe.json",
            "Interior of the Earth": "Geography/Interior_Earth.json",
            "Landforms": "Geography/Landforms.json",
            "Climatology": "Geography/Climatology.json",
            "Natural Vegetation & Wildlife": "Geography/Natural_Vegetation.json",
            "Climatic Regions": "Geography/Climatic_Regions.json",
            "Oceanography": "Geography/Oceanography.json",
            "World Resources": "Geography/World_Resources.json",
            "World Demography": "Geography/World_Demography.json",
            "Indian Geography": "Geography/Indian_Geography.json",
            "Census & Demography": "Geography/Census_Demography.json",
            "Location, Size & Physiography": "Geography/Location_Size_Physiography.json",
            "Indian Climate": "Geography/Indian_Climate.json",
            "Indian Rivers": "Geography/Indian_Rivers.json",
            "Soils of India": "Geography/Soils_India.json",
            "Agriculture": "Geography/Agriculture.json",
            "Natural Vegetation": "Geography/Natural_Vegetation_India.json",
            "Resources of India": "Geography/Resources_India.json",
            "Industries": "Geography/Industries.json",
            "Transport & Communication": "Geography/Transport_Communication.json"
        }
    },
    "Economy": {
        displayName: "💰 Economy",
        topics: {
            "Agriculture": "Economy/Agriculture.json",
            "MSP & Reforms": "Economy/MSP_Reforms.json",
            "Five Year Plans": "Economy/Five_Year_Plans.json",
            "Government Initiatives": "Economy/Government_Initiatives.json",
            "Economic Reforms 1991": "Economy/Economic_Reforms_1991.json",
            "National Income": "Economy/National_Income.json",
            "Budget & Fiscal Policy": "Economy/Budget_Fiscal_Policy.json",
            "Money & Banking": "Economy/Money_Banking.json",
            "External Sector": "Economy/External_Sector.json",
            "Foreign Trade": "Economy/Foreign_Trade.json",
            "Microeconomics": "Economy/Microeconomics.json",
            "Infrastructure": "Economy/Infrastructure.json",
            "Industrial Sector": "Economy/Industrial_Sector.json"
        }
    },
    "Ecology & Environment": {
        displayName: "🌱 Ecology & Environment",
        topics: {
            "Ecology & Ecosystem": "Ecology_Environment/Ecology_Ecosystem.json",
            "Biodiversity": "Ecology_Environment/Biodiversity.json",
            "Environmental Problems": "Ecology_Environment/Environmental_Problems.json",
            "Conservation Efforts": "Ecology_Environment/Conservation_Efforts.json"
        }
    }
};

// Base path for questions (adjust based on your folder structure)
const QUESTIONS_BASE_PATH = './questions/';

// Get all subjects for dropdown
function getAllSubjects() {
    return Object.keys(SUBJECT_TOPICS).map(key => ({
        value: key,
        label: SUBJECT_TOPICS[key].displayName
    }));
}

// Get topics for a specific subject
function getTopicsForSubject(subject) {
    if (!SUBJECT_TOPICS[subject]) {
        return [];
    }
    
    const topics = SUBJECT_TOPICS[subject].topics;
    return Object.keys(topics).map(topicName => ({
        value: topicName,
        label: topicName,
        path: topics[topicName]
    }));
}

// Get file path for a topic
function getTopicFilePath(subject, topic) {
    if (!SUBJECT_TOPICS[subject] || !SUBJECT_TOPICS[subject].topics[topic]) {
        return null;
    }
    
    return QUESTIONS_BASE_PATH + SUBJECT_TOPICS[subject].topics[topic];
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUBJECT_TOPICS,
        QUESTIONS_BASE_PATH,
        getAllSubjects,
        getTopicsForSubject,
        getTopicFilePath
    };
          }
