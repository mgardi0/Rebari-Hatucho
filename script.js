// script.js

// وەرگرتنی توخمەکانی ڕووکار (UI)
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

// توخمەکانی نوێی زمان
const langKuBtn = document.getElementById('lang-ku-btn');
const langArBtn = document.getElementById('lang-ar-btn');
const navTitle = document.getElementById('nav-title');
const creatorTag = document.getElementById('creator-tag');
const startBadge = document.getElementById('start-badge');
const startHeading = document.getElementById('start-heading');
const startBtnText = document.getElementById('start-btn-text');
const statusBadge = document.getElementById('status-badge');
const prevBtnText = document.getElementById('prev-btn-text');
const nextBtnText = document.getElementById('next-btn-text');
const gridTitle = document.getElementById('grid-title');
const resultHeading = document.getElementById('result-heading');
const resultScoreText = document.getElementById('result-score-text');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let userAnswers = {}; // پاشەکەوتکردنی وەڵامەکانی بەکارهێنەر
let currentLang = 'ku'; // زمانی بنچینەیی کوردییە

// دەقەکانی ڕووکار بۆ هەردوو زمانەکە (بێ وشەی نێکسەس)
const uiTexts = {
    ku: {
        navTitle: "تاقیکردنەوەی هاتووچۆ",
        creator: "ئامادەکراوە لە لایەن: <span class='text-white font-bold'>محمد گەردی</span>",
        badgeLoading: "بارکردنی پرسیارەکان...",
        badgeReady: "پرسیاری هەمەجۆر",
        heading: "سیستەمی هۆشیاری <br /><span class='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-500'>شۆفێری نێودەوڵەتی</span>",
        startBtn: "دەستپێکردن",
        statusActive: "تاقیکردنەوەی چالاک",
        prevBtn: "پرسیاری پێشوو",
        nextBtn: "پرسیاری دواتر",
        gridTitle: "پرسیارەکان (بازدان بۆ ژمارە)",
        resultHeading: "کۆتایی تاقیکردنەوە",
        resultScore: "ئەنجامی تۆ: <span id='score-display' class='text-4xl font-bold text-cyan-400 mx-2'>0</span> لە <span id='total-display' class='text-2xl font-bold text-white'>0</span>",
        restartBtn: "دووبارە کردنەوە",
        qWord: "پرسیاری",
        alertWait: "تکایە چاوەڕوانبە تا پرسیارەکان بار دەبن..."
    },
    ar: {
        navTitle: "إختبار المرور",
        creator: "إعداد: <span class='text-white font-bold'>محمد كَردي</span>",
        badgeLoading: "جاري تحميل الأسئلة...",
        badgeReady: "سؤال متنوع",
        heading: "نظام التوعية <br /><span class='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-500'>لقيادة السيارات الدولية</span>",
        startBtn: "ابدأ الاختبار",
        statusActive: "الاختبار النشط",
        prevBtn: "السؤال السابق",
        nextBtn: "السؤال التالي",
        gridTitle: "الأسئلة (الانتقال إلى الرقم)",
        resultHeading: "نهاية الاختبار",
        resultScore: "نتيجتك: <span id='score-display' class='text-4xl font-bold text-cyan-400 mx-2'>0</span> من <span id='total-display' class='text-2xl font-bold text-white'>0</span>",
        restartBtn: "إعادة الاختبار",
        qWord: "السؤال",
        alertWait: "يرجى الانتظار حتى يتم تحميل الأسئلة..."
    }
};

// فرمانەکانی گوێگرتن بۆ دوگمەکان
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
prevBtn.addEventListener('click', prevQuestion);
restartBtn.addEventListener('click', restartQuiz);
langKuBtn.addEventListener('click', () => switchLanguage('ku'));
langArBtn.addEventListener('click', () => switchLanguage('ar'));

// گۆڕینی زمان
function switchLanguage(lang) {
    currentLang = lang;
    
    // گۆڕینی ستایلی دوگمەکانی ناو نەڤبار
    if (lang === 'ku') {
        langKuBtn.className = "px-3 py-1.5 rounded-full transition-all bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold";
        langArBtn.className = "px-3 py-1.5 rounded-full transition-all text-slate-400 hover:text-white";
        document.documentElement.lang = "ckb";
    } else {
        langArBtn.className = "px-3 py-1.5 rounded-full transition-all bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold";
        langKuBtn.className = "px-3 py-1.5 rounded-full transition-all text-slate-400 hover:text-white";
        document.documentElement.lang = "ar";
    }

    // نوێکردنەوەی سەرجەم تێکستەکانی ڕووکار
    navTitle.innerText = uiTexts[lang].navTitle;
    creatorTag.innerHTML = uiTexts[lang].creator;
    startHeading.innerHTML = uiTexts[lang].heading;
    startBtnText.innerHTML = `${uiTexts[lang].startBtn} <i data-lucide="${lang === 'ku' ? 'arrow-left' : 'arrow-left'}" class="w-6 h-6 group-hover:-translate-x-1 transition-transform"></i>`;
    statusBadge.innerText = uiTexts[lang].statusActive;
    prevBtnText.innerText = uiTexts[lang].prevBtn;
    nextBtnText.innerText = uiTexts[lang].nextBtn;
    gridTitle.innerHTML = `<i data-lucide="layers" class="text-cyan-400 w-5 h-5"></i> ${uiTexts[lang].gridTitle}`;
    resultHeading.innerText = uiTexts[lang].resultHeading;
    restartBtn.innerText = uiTexts[lang].restartBtn;

    lucide.createIcons();
    
    // دووبارە بارکردنەوەی فایلە دروستەکە بەپێی زمان
    loadQuestionsData();
}

// بارکردنی داتای پرسیارەکان بەپێی زمانی دەستنیشانکراو
async function loadQuestionsData() {
    const fileName = currentLang === 'ku' ? 'questions.json' : 'questionsAR.json';
    try {
        const response = await fetch(fileName);
        questions = await response.json();
        
        // نوێکردنەوەی باجەکەی شاشەی سەرەکی
        startBadge.innerText = `${questions.length} ${uiTexts[currentLang].badgeReady}`;
        
        // ئەگەر لە ناوەڕاستی کویزەکەدا بوو، گریدی ژمارەکان چاک کەرەوە
        if (!quizScreen.classList.contains('hidden')) {
            buildQuestionsGrid();
            loadQuestion();
        }
    } catch (error) {
        console.error("هەڵە لە بارکردنی فایلی JSON:", error);
    }
}

// بارکردنی سەرەتایی لە کاتی کردنەوەی سایتەکە
loadQuestionsData();

function startQuiz() {
    if (questions.length === 0) {
        alert(uiTexts[currentLang].alertWait);
        return;
    }
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    quizScreen.classList.add('flex');
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = {};
    buildQuestionsGrid();
    loadQuestion();
}

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
    
    resultScoreText.innerHTML = `${uiTexts[currentLang].resultScore}`;
    
    const scoreDisp = document.getElementById('score-display');
    const totalDisp = document.getElementById('total-display');
    if(scoreDisp) scoreDisp.innerText = score;
    if(totalDisp) totalDisp.innerText = questions.length;
}

function restartQuiz() {
    resultScreen.classList.remove('flex');
    resultScreen.classList.add('hidden');
    userAnswers = {};
    buildQuestionsGrid();
    startQuiz();
}
