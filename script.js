// script.js

const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const questionCounter = document.getElementById('question-counter');
const scoreDisplay = document.getElementById('score-display');
const totalDisplay = document.getElementById('total-display');
const restartBtn = document.getElementById('restart-btn');
const questionsGrid = document.getElementById('questions-grid');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let userAnswers = {}; // بۆ پاشەکەوتکردنی وەڵامەکانی بەکارهێنەر

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
prevBtn.addEventListener('click', prevQuestion);
restartBtn.addEventListener('click', restartQuiz);

async function loadQuestionsData() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        const badge = document.querySelector('#start-screen span');
        if(badge) badge.innerText = `زیاتر لە ${questions.length} پرسیاری هەمەجۆر`;
        buildQuestionsGrid();
    } catch (error) {
        console.error("هەڵە لە بارکردنی JSON:", error);
    }
}

loadQuestionsData();

function startQuiz() {
    if (questions.length === 0) return;
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    quizScreen.classList.add('flex');
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = {};
    loadQuestion();
}

// دروستکردنی خانەکانی بازدان (Grid Numbers)
function buildQuestionsGrid() {
    questionsGrid.innerHTML = '';
    questions.forEach((_, index) => {
        const cell = document.createElement('button');
        cell.innerText = index + 1;
        cell.id = `grid-cell-${index}`;
        cell.className = 'p-2 text-center rounded-lg bg-white/5 border border-white/10 text-slate-300 font-medium hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/40 transition-all text-sm';
        cell.addEventListener('click', () => {
            currentQuestionIndex = index;
            loadQuestion();
        });
        questionsGrid.appendChild(cell);
    });
}

function loadQuestion() {
    optionsContainer.innerHTML = '';
    const currentQuestion = questions[currentQuestionIndex];
    
    questionCounter.innerText = `پرسیاری ${currentQuestionIndex + 1} / ${questions.length}`;
    questionText.innerText = currentQuestion.q;
    
    // کۆنترۆڵکردنی دەرکەوتنی دوگمەی پێشوو
    if (currentQuestionIndex === 0) {
        prevBtn.classList.add('opacity-50', 'pointer-events-none');
    } else {
        prevBtn.classList.remove('opacity-50', 'pointer-events-none');
    }

    // گۆڕینی دیزاینی خانەی دەستنیشانکراو لە Grid
    document.querySelectorAll('[id^="grid-cell-"]').forEach(btn => btn.classList.remove('bg-cyan-500/30', 'text-white', 'border-cyan-400'));
    const activeCell = document.getElementById(`grid-cell-${currentQuestionIndex}`);
    if (activeCell) activeCell.classList.add('bg-cyan-500/30', 'text-white', 'border-cyan-400');

    currentQuestion.o.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.className = 'option-btn w-full text-right p-5 rounded-2xl glass-card border border-white/10 text-slate-200 font-nrt text-lg hover:bg-white/10 mb-3';
        
        // ئەگەر پێشتر وەڵام درابێتەوە، ڕەنگەکەی نیشان بدە
        if (userAnswers[currentQuestionIndex] !== undefined) {
            button.classList.add('option-disabled');
            if (index === currentQuestion.a) {
                button.classList.add('option-correct');
                button.innerHTML = `<div class="flex justify-between items-center w-full"><span>${option}</span><i data-lucide="check-circle" class="w-6 h-6 text-white"></i></div>`;
            } else if (index === userAnswers[currentQuestionIndex]) {
                button.classList.add('option-incorrect');
                button.innerHTML = `<div class="flex justify-between items-center w-full"><span>${option}</span><i data-lucide="x-circle" class="w-6 h-6 text-white"></i></div>`;
            }
        } else {
            button.addEventListener('click', () => selectOption(index, currentQuestion.a, button));
        }
        optionsContainer.appendChild(button);
    });

    lucide.createIcons();
}

function selectOption(selectedIndex, correctIndex, selectedButton) {
    userAnswers[currentQuestionIndex] = selectedIndex;
    const buttons = optionsContainer.querySelectorAll('button');
    
    buttons.forEach((btn, index) => {
        btn.classList.add('option-disabled');
        if (index === correctIndex) {
            btn.classList.add('option-correct');
            btn.innerHTML = `<div class="flex justify-between items-center w-full"><span>${btn.innerText}</span><i data-lucide="check-circle" class="w-6 h-6 text-white"></i></div>`;
        }
    });
    
    if (selectedIndex !== correctIndex) {
        selectedButton.classList.add('option-incorrect');
        selectedButton.innerHTML = `<div class="flex justify-between items-center w-full"><span>${selectedButton.innerText}</span><i data-lucide="x-circle" class="w-6 h-6 text-white"></i></div>`;
    }
    
    // نوێکردنەوەی ڕەنگی خانەکە لە Grid دوای وەڵامدانەوە
    const gridCell = document.getElementById(`grid-cell-${currentQuestionIndex}`);
    if (gridCell) {
        if (selectedIndex === correctIndex) {
            gridCell.classList.add('bg-emerald-500/20', 'border-emerald-500/40', 'text-emerald-400');
        } else {
            gridCell.classList.add('bg-red-500/20', 'border-red-500/40', 'text-red-400');
        }
    }

    lucide.createIcons();
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        calculateFinalScore();
        showResults();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function calculateFinalScore() {
    score = 0;
    questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.a) score++;
    });
}

function showResults() {
    quizScreen.classList.remove('flex');
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    resultScreen.classList.add('flex');
    
    scoreDisplay.innerText = score;
    totalDisplay.innerText = questions.length;
}

function restartQuiz() {
    resultScreen.classList.remove('flex');
    resultScreen.classList.add('hidden');
    // نوێکردنەوەی خانەکانی بازدان بۆ باری سەرەتایی
    buildQuestionsGrid();
    startQuiz();
}
