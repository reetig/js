document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const voiceSearchButton = document.getElementById('voice-search-button');
    const categoryDropdown = document.getElementById('quiz-category-dropdown');
    const quizContainer = document.getElementById('quiz-container');
    const calcButtons = document.querySelectorAll('.calc-buttons button');
    const calcDisplay = document.getElementById('calc-display');
    const progressBar = document.getElementById('progress-bar');
    const tabButtons = document.querySelectorAll('.tab-button');
    let correctAnswers = 0;
    let totalQuestions = 0;
    let startTime;

    //  quiz categories
    const categories = ['All Categories', 'History', 'Science', 'Math', 'Biology'];

    //  quiz data
    const quizzes = {
        history: {
            easy: [
                { question: "Who was the first president of the United States?", answers: ["George Washington", "John Adams", "Thomas Jefferson", "James Madison"], correct: 0 },
            ],
            medium: [
                { question: "In what year did World War II end?", answers: ["1945", "1944", "1943", "1942"], correct: 0 },
            ],
            hard: [
                { question: "Which treaty ended World War I?", answers: ["Treaty of Paris", "Treaty of Versailles", "Treaty of Ghent", "Treaty of Vienna"], correct: 1 },
            ]
        },
        science: {
            easy: [
                { question: "What is the chemical symbol for water?", answers: ["H2O", "O2", "H2", "HO2"], correct: 0 },
            ],
            medium: [
                { question: "What planet is known as the Red Planet?", answers: ["Mars", "Earth", "Jupiter", "Saturn"], correct: 0 },
            ],
            hard: [
                { question: "What is the powerhouse of the cell?", answers: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"], correct: 1 },
            ]
        },
        math: {
            easy: [
                { question: "What is 2+2?", answers: ["4", "3", "5", "6"], correct: 0 },
            ],
            medium: [
                { question: "What is the square root of 9?", answers: ["3", "2", "4", "5"], correct: 0 },
            ],
            hard: [
                { question: "What is 12*12?", answers: ["144", "150", "120", "130"], correct: 0 },
            ]
        },
        biology: {
            easy: [
                { question: "What is the powerhouse of the cell?", answers: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"], correct: 1 },
            ],
            medium: [
                { question: "What molecule carries genetic information?", answers: ["RNA", "DNA", "Protein", "Lipid"], correct: 1 },
            ],
            hard: [
                { question: "What process do plants use to make their own food?", answers: ["Photosynthesis", "Respiration", "Digestion", "Fermentation"], correct: 0 },
            ]
        }
    };

    // Function to load categories into dropdown
    function loadCategories() {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.toLowerCase();
            option.textContent = category;
            categoryDropdown.appendChild(option);
        });
    }

    // Function to load questions for the selected category and difficulty
    function loadQuestions(category, difficulty) {
        quizContainer.innerHTML = '';
        const questions = quizzes[category][difficulty] || [];
        questions.sort(() => Math.random() - 0.5); // Shuffle questions randomly
        totalQuestions = questions.length;
        questions.forEach(q => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            questionElement.innerHTML = `
                <p>${q.question}</p>
                ${q.answers.map((answer, i) => `<button class="answer" data-correct="${q.correct}" data-answer="${i}">${answer}</button>`).join('')}
            `;
            quizContainer.appendChild(questionElement);
        });
        startTimer();
    }

    // Event listener for category change
    categoryDropdown.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        const activeTab = document.querySelector('.tab-button.active');
        const difficulty = activeTab ? activeTab.dataset.difficulty : 'easy';
        loadQuestions(selectedCategory, difficulty);
    });

    // Event listener for tab change
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const selectedCategory = categoryDropdown.value;
            const difficulty = button.dataset.difficulty;
            loadQuestions(selectedCategory, difficulty);
        });
    });

    // Function to start the timer
    function startTimer() {
        startTime = new Date().getTime();
    }

    // Function to stop the timer and display the elapsed time
    function stopTimer() {
        const endTime = new Date().getTime();
        const elapsedTime = (endTime - startTime) / 1000; // in seconds
        alert(`Elapsed time: ${elapsedTime} seconds`);
    }

    // Event listener for answer clicks
    quizContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('answer')) {
            const correctAnswer = e.target.getAttribute('data-correct');
            const selectedAnswer = e.target.getAttribute('data-answer');
            stopTimer();
            if (correctAnswer === selectedAnswer) {
                e.target.style.backgroundColor = 'green';
                correctAnswers++;
            } else {
                e.target.style.backgroundColor = 'red';
            }
            setTimeout(() => {
                const selectedCategory = categoryDropdown.value;
                const activeTab = document.querySelector('.tab-button.active');
                const difficulty = activeTab ? activeTab.dataset.difficulty : 'easy';
                loadQuestions(selectedCategory, difficulty);
            }, 1000);
            updateProgress();
        }
    });

    // Function to update progress bar
    function updateProgress() {
        const progress = (correctAnswers / totalQuestions) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Load categories into the dropdown on page load
    loadCategories();

    // Calculator functionality
    calcButtons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            if (value === 'C') {
                calcDisplay.value = '';
            } else if (value === '=') {
                calcDisplay.value = eval(calcDisplay.value);
            } else {
                calcDisplay.value += value;
            }
        });
    });

    // Voice search functionality
    voiceSearchButton.addEventListener('click', () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.onresult = (event) => {
            searchBar.value = event.results[0][0].transcript;
        };
        recognition.start();
    });
});
