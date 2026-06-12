// script.js

const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const questionCounter = document.getElementById('question-counter');
const scoreDisplay = document.getElementById('score-display');
const totalDisplay = document.getElementById('total-display');
const restartBtn = document.getElementById('restart-btn');

let currentQuestionIndex = 0;
let score = 0;
let questions = []; // لێرەدا لیستەکە بە بەتاڵی جێدەهێڵین تەنها

// فرمانەکانی گوێگرتن بۆ دوگمەکان
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);

// هێنانی پرسیارەکان لە فایلی دەرەکی JSON پێش دەستپێکردن
async function loadQuestionsData() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        // نوێکردنەوەی ژمارەی گشتی پرسیارەکان لەسەر شاشەی سەرەکی
        const countSpan = document.querySelector('#start-screen .bg-white\\/5 span');
        if(countSpan) countSpan.innerText = `زیاتر لە ${questions.length} پرسیاری هەمەجۆر`;
    } catch (error) {
        console.error("هەڵە لە هێنانی فایلی پرسیارەکان:", error);
    }
}

// بارکردنی داتا لە کاتی کەرنەوەی سایتەکە
loadQuestionsData();

function startQuiz() {
    if (questions.length === 0) {
        alert("تکایە چاوەڕوانبە تا پرسیارەکان بار دەبن...");
        return;
    }
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    quizScreen.classList.add('flex');
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
}

function loadQuestion() {
    nextBtn.classList.add('hidden');
    optionsContainer.innerHTML = '';
    
    const currentQuestion = questions[currentQuestionIndex];
    questionCounter.innerText = `پرسیاری ${currentQuestionIndex + 1} / ${questions.length}`;
    questionText.innerText = currentQuestion.q;
    
    currentQuestion.o.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.className = 'option-btn w-full text-right p-5 rounded-2xl glass-card border border-white/10 text-slate-200 font-nrt text-lg hover:bg-white/10 mb-3';
        button.addEventListener('click', () => selectOption(index, currentQuestion.a, button));
        optionsContainer.appendChild(button);
    });
}

function selectOption(selectedIndex, correctIndex, selectedButton) {
    const buttons = optionsContainer.querySelectorAll('button');
    
    buttons.forEach((btn, index) => {
        btn.classList.add('option-disabled');
        if (index === correctIndex) {
            btn.classList.add('option-correct');
            btn.innerHTML = `<div class="flex justify-between items-center w-full"><span>${btn.innerText}</span><i data-lucide="check-circle" class="w-6 h-6 text-white"></i></div>`;
        }
    });
    
    if (selectedIndex === correctIndex) {
        score++;
    } else {
        selectedButton.classList.add('option-incorrect');
        selectedButton.innerHTML = `<div class="flex justify-between items-center w-full"><span>${selectedButton.innerText}</span><i data-lucide="x-circle" class="w-6 h-6 text-white"></i></div>`;
    }
    
    lucide.createIcons();
    nextBtn.classList.remove('hidden');
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
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
    startQuiz();
}
