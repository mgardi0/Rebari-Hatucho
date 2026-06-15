// script.js

// وەرگرتنی توخمەکانی ڕووکار (UI)
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const questionCounter = document.getElementById('question-counter');
const restartBtn = document.getElementById('restart-btn');
const questionsGrid = document.getElementById('questions-grid');

// توخمەکانی زمان و سەرەتا
const startKuBtn = document.getElementById('start-ku-btn');
const startArBtn = document.getElementById('start-ar-btn');
const navTitle = document.getElementById('nav-title');
const creatorTag = document.getElementById('creator-tag');
const statusBadge = document.getElementById('status-badge');
const prevBtnText = document.getElementById('prev-btn-text');
const nextBtnText = document.getElementById('next-btn-text');
const gridTitleText = document.getElementById('grid-title-text');
const resultHeading = document.getElementById('result-heading');
const resultScoreText = document.getElementById('result-score-text');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let userAnswers = {}; // پاشەکەوتکردنی وەڵامەکانی بەکارهێنەر
let currentLang = 'ku'; // زمانی بنچینەیی

// دەقەکانی ڕووکار بۆ هەردوو زمانەکە
const uiTexts = {
    ku: {
        navTitle: "تاقیکردنەوەی شۆفێری",
        creator: "ئامادەکراوە لە لایەن: <span class='text-white font-bold'>محمد گەردی</span>",
        statusActive: "تاقیکردنەوەی چالاک",
        prevBtn: "پرسیاری پێشوو",
        nextBtn: "پرسیاری دواتر",
        gridTitle: "پرسیارەکان",
        resultHeading: "کۆتایی تاقیکردنەوە",
        restartBtn: "گەڕانەوە بۆ سەرەتا",
        qWord: "پرسیاری",
        fetchError: "کێشەیەک هەیە لە هێنانی پرسیارەکان. تکایە ئینتەرنێتەکەت بپشکنە."
    },
    ar: {
        navTitle: "اختبار القيادة",
        creator: "إعداد: <span class='text-white font-bold'>محمد كَردي</span>",
        statusActive: "الاختبار نشط",
        prevBtn: "السؤال السابق",
        nextBtn: "السؤال التالي",
        gridTitle: "الأسئلة",
        resultHeading: "نهاية الاختبار",
        restartBtn: "العودة للبداية",
        qWord: "السؤال",
        fetchError: "حدث خطأ في تحميل الأسئلة. يرجى التحقق من الاتصال بالإنترنت."
    }
};

// فرمانەکانی گوێگرتن بۆ دوگمەکان
startKuBtn.addEventListener('click', () => startQuiz('ku'));
startArBtn.addEventListener('click', () => startQuiz('ar'));
nextBtn.addEventListener('click', nextQuestion);
prevBtn.addEventListener('click', prevQuestion);
restartBtn.addEventListener('click', returnToStart);

// فەنکشنی دەستپێکردن بەپێی زمان
async function startQuiz(lang) {
    currentLang = lang;
    
    // نوێکردنەوەی تێکستەکانی ڕووکار پێش بارکردن
    navTitle.innerText = uiTexts[lang].navTitle;
    creatorTag.innerHTML = uiTexts[lang].creator;
    statusBadge.innerText = uiTexts[lang].statusActive;
    prevBtnText.innerText = uiTexts[lang].prevBtn;
    nextBtnText.innerText = uiTexts[lang].nextBtn;
    gridTitleText.innerText = uiTexts[lang].gridTitle;
    resultHeading.innerText = uiTexts[lang].resultHeading;
    restartBtn.innerText = uiTexts[lang].restartBtn;
    document.documentElement.lang = lang === 'ku' ? "ckb" : "ar";

    // گۆڕینی دوگمە بۆ باری 'چاوەڕێبە' کاتی بارکردن
    const btn = lang === 'ku' ? startKuBtn : startArBtn;
    const originalContent = btn.innerHTML;
    btn.innerHTML = `<span class="relative flex items-center justify-center gap-3 text-2xl font-nrt"><i data-lucide="loader-2" class="w-6 h-6 animate-spin"></i></span>`;
    lucide.createIcons();

    try {
        // دیاریکردنی ناوی فایلەکان بەپێی زمان
        const fileName = lang === 'ku' ? 'questions.json' : 'questionsar.json';
        const response = await fetch(fileName);
        
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        
        questions = await response.json();
        
        // سفرکردنەوەی داتاکان
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = {};

        // گۆڕینی شاشەکان
        startScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        quizScreen.classList.add('flex');

        buildQuestionsGrid();
        loadQuestion();

    } catch (error) {
        console.error("هەڵە لە بارکردنی فایلی JSON:", error);
        alert(uiTexts[lang].fetchError);
    } finally {
        // گەڕاندنەوەی شێوەی دوگمەکە ئەگەر کێشەیەک هەبوو یان دوای بارکردن
        btn.innerHTML = originalContent;
        lucide.createIcons();
    }
}

// دروستکردنی خانەکانی بازدان
function buildQuestionsGrid() {
    questionsGrid.innerHTML = '';
    questions.forEach((_, index) => {
        const cell = document.createElement('button');
        cell.innerText = index + 1;
        cell.id = `grid-cell-${index}`;
        cell.className = 'p-2 text-center rounded-lg bg-white/5 border border-white/10 text-slate-300 font-medium hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/40 transition-all text-sm';
        
        // ئەگەر خانەکە پێشتر وەڵام درابێتەوە ڕەنگەکەی بپارێزە
        if (userAnswers[index] !== undefined) {
            if (userAnswers[index] === questions[index].a) {
                cell.classList.add('bg-emerald-500/20', 'border-emerald-500/40', 'text-emerald-400');
            } else {
                cell.classList.add('bg-red-500/20', 'border-red-500/40', 'text-red-400');
            }
        }
        
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
    
    questionCounter.innerText = `${uiTexts[currentLang].qWord} ${currentQuestionIndex + 1} / ${questions.length}`;
    questionText.innerText = currentQuestion.q;
    
    // شاردنەوە یان پیشاندانی دوگمەی پێشوو
    if (currentQuestionIndex === 0) {
        prevBtn.classList.add('opacity-50', 'pointer-events-none');
    } else {
        prevBtn.classList.remove('opacity-50', 'pointer-events-none');
    }

    // ڕێکخستنی دیزاینی خانە چالاکەکە لە نێو گرید
    document.querySelectorAll('[id^="grid-cell-"]').forEach(btn => btn.classList.remove('bg-cyan-500/30', 'text-white', 'border-cyan-400'));
    const activeCell = document.getElementById(`grid-cell-${currentQuestionIndex}`);
    if (activeCell) activeCell.classList.add('bg-cyan-500/30', 'text-white', 'border-cyan-400');

    currentQuestion.o.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.className = 'option-btn w-full text-right p-5 rounded-2xl glass-card border border-white/10 text-slate-200 font-nrt text-lg hover:bg-white/10 mb-3';
        
        // نیشاندانی ڕەنگی وەڵامەکان ئەگەر پێشتر وەڵام درابێتەوە
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
    
    // نوێکردنەوەی ڕەنگی خانەکە لە سندوقی بازدان
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
    
    // داڕشتنی تێکستی ئەنجام بەپێی زمان
    const resultText = currentLang === 'ku'
        ? `ئەنجامی تۆ: <span id="score-display" class="text-4xl font-bold text-cyan-400 mx-2">${score}</span> لە <span id="total-display" class="text-2xl font-bold text-white">${questions.length}</span>`
        : `نتيجتك: <span id="score-display" class="text-4xl font-bold text-cyan-400 mx-2">${score}</span> من <span id="total-display" class="text-2xl font-bold text-white">${questions.length}</span>`;
        
    resultScoreText.innerHTML = resultText;
}

// گەڕانەوە بۆ شاشەی سەرەکی
function returnToStart() {
    resultScreen.classList.remove('flex');
    resultScreen.classList.add('hidden');
    
    startScreen.classList.remove('hidden');
    // لەبەر ئەوەی ستایلی شاشەی سەرەکی flex ە نەک تەنها block
    
    questions = [];
    userAnswers = {};
}
