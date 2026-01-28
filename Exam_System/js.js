// Application State
const app = {
    currentUser: null,
    currentRole: 'student',
    exams: [],
    submissions: [],
    currentExam: null,
    currentQuestionIndex: 0,
    answers: {},
    timer: null,
    timeRemaining: 0,
    tabSwitchCount: 0
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initializeEventListeners();
    createSampleData();
});

// Data Management
function loadData() {
    const savedExams = localStorage.getItem('exams');
    const savedSubmissions = localStorage.getItem('submissions');

    if (savedExams) app.exams = JSON.parse(savedExams);
    if (savedSubmissions) app.submissions = JSON.parse(savedSubmissions);
}

function saveData() {
    localStorage.setItem('exams', JSON.stringify(app.exams));
    localStorage.setItem('submissions', JSON.stringify(app.submissions));
}

function createSampleData() {
    if (app.exams.length === 0) {
        app.exams = [
            {
                id: 1,
                title: "Mathematics Fundamentals",
                description: "Test your knowledge of basic mathematical concepts",
                duration: 30,
                totalMarks: 50,
                questions: [
                    {
                        id: 1,
                        type: "mcq",
                        text: "What is the value of π (pi) approximately?",
                        options: ["3.14159", "2.71828", "1.41421", "1.61803"],
                        correctAnswer: 0,
                        marks: 5
                    },
                    {
                        id: 2,
                        type: "mcq",
                        text: "What is the quadratic formula?",
                        options: [
                            "x = (-b ± √(b²-4ac)) / 2a",
                            "x = -b / 2a",
                            "x = √(b²-4ac)",
                            "x = b² - 4ac"
                        ],
                        correctAnswer: 0,
                        marks: 5
                    },
                    {
                        id: 3,
                        type: "mcq",
                        text: "What is 15% of 200?",
                        options: ["30", "25", "35", "20"],
                        correctAnswer: 0,
                        marks: 5
                    },
                    {
                        id: 4,
                        type: "mcq",
                        text: "What is the sum of angles in a triangle?",
                        options: ["180°", "90°", "360°", "270°"],
                        correctAnswer: 0,
                        marks: 5
                    },
                    {
                        id: 5,
                        type: "descriptive",
                        text: "Explain the Pythagorean theorem and provide an example of its application.",
                        marks: 10
                    },
                    {
                        id: 6,
                        type: "descriptive",
                        text: "Solve the equation: 2x + 5 = 15. Show your work.",
                        marks: 10
                    },
                    {
                        id: 7,
                        type: "mcq",
                        text: "What is the derivative of x²?",
                        options: ["2x", "x", "x²", "2x²"],
                        correctAnswer: 0,
                        marks: 5
                    },
                    {
                        id: 8,
                        type: "descriptive",
                        text: "Calculate the area of a circle with radius 7 cm. (Use π = 3.14)",
                        marks: 5
                    }
                ],
                status: "active",
                createdBy: "Dr. Smith"
            },
            {
                id: 2,
                title: "Computer Science Basics",
                description: "Introduction to programming and algorithms",
                duration: 45,
                totalMarks: 60,
                questions: [
                    {
                        id: 1,
                        type: "mcq",
                        text: "What does HTML stand for?",
                        options: [
                            "Hyper Text Markup Language",
                            "High Tech Modern Language",
                            "Home Tool Markup Language",
                            "Hyperlinks and Text Markup Language"
                        ],
                        correctAnswer: 0,
                        marks: 5
                    },
                    {
                        id: 2,
                        type: "mcq",
                        text: "Which data structure uses LIFO?",
                        options: ["Stack", "Queue", "Array", "Tree"],
                        correctAnswer: 0,
                        marks: 5
                    },
                    {
                        id: 3,
                        type: "descriptive",
                        text: "Write a simple algorithm to find the maximum number in an array.",
                        marks: 15
                    },
                    {
                        id: 4,
                        type: "mcq",
                        text: "What is the time complexity of binary search?",
                        options: ["O(log n)", "O(n)", "O(n²)", "O(1)"],
                        correctAnswer: 0,
                        marks: 5
                    },
                    {
                        id: 5,
                        type: "descriptive",
                        text: "Explain the difference between compile-time and runtime errors with examples.",
                        marks: 15
                    },
                    {
                        id: 6,
                        type: "mcq",
                        text: "Which of the following is NOT a programming paradigm?",
                        options: ["Object-Oriented", "Functional", "Procedural", "Sequential"],
                        correctAnswer: 3,
                        marks: 5
                    },
                    {
                        id: 7,
                        type: "descriptive",
                        text: "What is recursion? Provide a simple example.",
                        marks: 10
                    }
                ],
                status: "active",
                createdBy: "Prof. Johnson"
            }
        ];
        saveData();
    }
}

// Event Listeners
function initializeEventListeners() {
    // Role selection
    document.querySelectorAll('.role-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            app.currentRole = option.dataset.role;
        });
    });

    // Login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Teacher actions
    document.getElementById('createExamBtn')?.addEventListener('click', showCreateExamModal);
    document.getElementById('viewSubmissionsBtn')?.addEventListener('click', showSubmissions);
    document.getElementById('cancelCreateBtn')?.addEventListener('click', hideCreateExamModal);
    document.getElementById('closeSubmissionsBtn')?.addEventListener('click', hideSubmissionsModal);
    document.getElementById('createExamForm')?.addEventListener('submit', handleCreateExam);
    document.getElementById('addQuestionBtn')?.addEventListener('click', addQuestionBuilder);

    // Exam navigation
    document.getElementById('prevBtn')?.addEventListener('click', previousQuestion);
    document.getElementById('nextBtn')?.addEventListener('click', nextQuestion);
    document.getElementById('submitExamBtn')?.addEventListener('click', submitExam);
    document.getElementById('backToDashboardBtn')?.addEventListener('click', backToDashboard);

    // Tab switch detection
    document.addEventListener('visibilitychange', handleTabSwitch);
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple authentication (in real app, use proper auth)
    if (username && password) {
        app.currentUser = {
            username: username,
            role: app.currentRole
        };

        document.getElementById('userBadge').textContent = `${username} (${app.currentRole})`;
        document.getElementById('logoutBtn').style.display = 'block';

        showScreen(app.currentRole === 'student' ? 'studentDashboard' : 'teacherDashboard');

        if (app.currentRole === 'student') {
            loadStudentDashboard();
        } else {
            loadTeacherDashboard();
        }
    }
}

function handleLogout() {
    app.currentUser = null;
    app.currentExam = null;
    app.answers = {};
    document.getElementById('userBadge').textContent = 'Guest';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    showScreen('loginScreen');
}

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Student Dashboard
function loadStudentDashboard() {
    const userSubmissions = app.submissions.filter(s => s.username === app.currentUser.username);
    const completedExamIds = userSubmissions.map(s => s.examId);

    document.getElementById('totalExams').textContent = app.exams.length;
    document.getElementById('completedExams').textContent = userSubmissions.length;

    const avgScore = userSubmissions.length > 0
        ? Math.round(userSubmissions.reduce((sum, s) => sum + s.percentage, 0) / userSubmissions.length)
        : 0;
    document.getElementById('avgScore').textContent = avgScore + '%';

    const examList = document.getElementById('examList');
    examList.innerHTML = '';

    app.exams.forEach(exam => {
        const isCompleted = completedExamIds.includes(exam.id);
        const submission = userSubmissions.find(s => s.examId === exam.id);

        const card = document.createElement('div');
        card.className = 'exam-card';
        card.innerHTML = `
                    <div class="exam-info">
                        <h3>${exam.title}</h3>
                        <div class="exam-meta">
                            <div class="exam-meta-item">⏱️ <span>${exam.duration} mins</span></div>
                            <div class="exam-meta-item">📊 <span>${exam.totalMarks} marks</span></div>
                            <div class="exam-meta-item">❓ <span>${exam.questions.length} questions</span></div>
                        </div>
                        <div class="exam-tags">
                            <span class="tag ${exam.status}">${exam.status}</span>
                            ${isCompleted ? `<span class="tag completed">Completed - ${submission.percentage}%</span>` : ''}
                        </div>
                    </div>
                    <div>
                        ${!isCompleted
                ? `<button class="btn btn-primary" onclick="startExam(${exam.id})">Start Exam</button>`
                : `<button class="btn btn-secondary" onclick="viewResults(${submission.id})">View Results</button>`
            }
                    </div>
                `;
        examList.appendChild(card);
    });
}

// Teacher Dashboard
function loadTeacherDashboard() {
    const examList = document.getElementById('teacherExamList');
    examList.innerHTML = '';

    app.exams.forEach(exam => {
        const submissions = app.submissions.filter(s => s.examId === exam.id);

        const card = document.createElement('div');
        card.className = 'exam-card';
        card.innerHTML = `
                    <div class="exam-info">
                        <h3>${exam.title}</h3>
                        <div class="exam-meta">
                            <div class="exam-meta-item">⏱️ <span>${exam.duration} mins</span></div>
                            <div class="exam-meta-item">📊 <span>${exam.totalMarks} marks</span></div>
                            <div class="exam-meta-item">👥 <span>${submissions.length} submissions</span></div>
                        </div>
                        <div class="exam-tags">
                            <span class="tag ${exam.status}">${exam.status}</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button class="btn btn-secondary" onclick="viewExamSubmissions(${exam.id})">
                            View Submissions
                        </button>
                        <button class="btn btn-danger" onclick="deleteExam(${exam.id})">Delete</button>
                    </div>
                `;
        examList.appendChild(card);
    });
}

// Exam Taking
function startExam(examId) {
    app.currentExam = app.exams.find(e => e.id === examId);
    if (!app.currentExam) return;

    app.currentQuestionIndex = 0;
    app.answers = {};
    app.timeRemaining = app.currentExam.duration * 60;
    app.tabSwitchCount = 0;

    document.getElementById('examTitle').textContent = app.currentExam.title;
    document.getElementById('examDescription').textContent = app.currentExam.description;

    renderQuestionNavigator();
    renderQuestion();
    startTimer();
    showScreen('examScreen');
}

function renderQuestionNavigator() {
    const container = document.getElementById('questionBullets');
    container.innerHTML = '';

    app.currentExam.questions.forEach((q, index) => {
        const bullet = document.createElement('div');
        bullet.className = 'question-bullet';
        if (index === app.currentQuestionIndex) bullet.classList.add('current');
        if (app.answers[q.id] !== undefined) bullet.classList.add('answered');
        bullet.textContent = index + 1;
        bullet.onclick = () => goToQuestion(index);
        container.appendChild(bullet);
    });
}

function renderQuestion() {
    const question = app.currentExam.questions[app.currentQuestionIndex];
    const container = document.getElementById('questionContainer');

    let optionsHtml = '';
    if (question.type === 'mcq') {
        optionsHtml = `
                    <div class="options">
                        ${question.options.map((opt, idx) => `
                            <div class="option ${app.answers[question.id] === idx ? 'selected' : ''}" 
                                 onclick="selectOption(${question.id}, ${idx})">
                                <div class="option-letter">${String.fromCharCode(65 + idx)}</div>
                                <div>${opt}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
    } else {
        optionsHtml = `
                    <div class="answer-area">
                        <textarea placeholder="Type your answer here..." 
                                  onchange="saveDescriptiveAnswer(${question.id}, this.value)"
                                  class="form-group"
                                  style="width: 100%;">${app.answers[question.id] || ''}</textarea>
                    </div>
                `;
    }

    container.innerHTML = `
                <div class="question-card">
                    <div class="question-header">
                        <span class="question-number">Question ${app.currentQuestionIndex + 1} of ${app.currentExam.questions.length}</span>
                        <span class="question-type">${question.type === 'mcq' ? 'Multiple Choice' : 'Descriptive'} • ${question.marks} marks</span>
                    </div>
                    <div class="question-text">${question.text}</div>
                    ${optionsHtml}
                </div>
            `;

    renderQuestionNavigator();

    // Update button states
    document.getElementById('prevBtn').disabled = app.currentQuestionIndex === 0;
    document.getElementById('nextBtn').style.display =
        app.currentQuestionIndex === app.currentExam.questions.length - 1 ? 'none' : 'block';
}

function selectOption(questionId, optionIndex) {
    app.answers[questionId] = optionIndex;
    renderQuestion();
}

function saveDescriptiveAnswer(questionId, value) {
    app.answers[questionId] = value;
    renderQuestionNavigator();
}

function previousQuestion() {
    if (app.currentQuestionIndex > 0) {
        app.currentQuestionIndex--;
        renderQuestion();
    }
}

function nextQuestion() {
    if (app.currentQuestionIndex < app.currentExam.questions.length - 1) {
        app.currentQuestionIndex++;
        renderQuestion();
    }
}

function goToQuestion(index) {
    app.currentQuestionIndex = index;
    renderQuestion();
}

// Timer
function startTimer() {
    if (app.timer) clearInterval(app.timer);

    app.timer = setInterval(() => {
        app.timeRemaining--;
        updateTimerDisplay();

        if (app.timeRemaining <= 0) {
            clearInterval(app.timer);
            submitExam();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(app.timeRemaining / 60);
    const seconds = app.timeRemaining % 60;
    const timerEl = document.getElementById('timer');
    timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    timerEl.classList.remove('warning', 'danger');
    if (app.timeRemaining <= 60) {
        timerEl.classList.add('danger');
    } else if (app.timeRemaining <= 300) {
        timerEl.classList.add('warning');
    }
}

// Tab Switch Detection
function handleTabSwitch() {
    if (document.hidden && app.currentExam) {
        app.tabSwitchCount++;
        showAlert('⚠️ Warning', `Tab switch detected! Count: ${app.tabSwitchCount}. Please focus on the exam.`);
    }
}

function showAlert(title, message) {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) existingAlert.remove();

    const alert = document.createElement('div');
    alert.className = 'alert';
    alert.innerHTML = `
                <div class="alert-header">
                    <span class="alert-icon">⚠️</span>
                    <span class="alert-title">${title}</span>
                </div>
                <div class="alert-message">${message}</div>
            `;
    document.body.appendChild(alert);

    setTimeout(() => alert.remove(), 5000);
}

// Exam Submission
function submitExam() {
    if (app.timer) clearInterval(app.timer);

    if (!confirm('Are you sure you want to submit the exam? This action cannot be undone.')) {
        if (app.timeRemaining > 0) startTimer();
        return;
    }

    // Calculate score
    let totalMarks = 0;
    let earnedMarks = 0;
    let correct = 0;
    let incorrect = 0;

    const answers = [];

    app.currentExam.questions.forEach(question => {
        totalMarks += question.marks;
        const userAnswer = app.answers[question.id];

        if (question.type === 'mcq') {
            if (userAnswer === question.correctAnswer) {
                earnedMarks += question.marks;
                correct++;
                answers.push({ questionId: question.id, answer: userAnswer, marks: question.marks });
            } else {
                incorrect++;
                answers.push({ questionId: question.id, answer: userAnswer, marks: 0 });
            }
        } else {
            // Descriptive questions need manual evaluation
            answers.push({ questionId: question.id, answer: userAnswer, marks: null });
        }
    });

    const percentage = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;

    const submission = {
        id: Date.now(),
        examId: app.currentExam.id,
        username: app.currentUser.username,
        answers: answers,
        totalMarks: totalMarks,
        earnedMarks: earnedMarks,
        percentage: percentage,
        correct: correct,
        incorrect: incorrect,
        tabSwitches: app.tabSwitchCount,
        submittedAt: new Date().toISOString(),
        needsManualGrading: app.currentExam.questions.some(q => q.type === 'descriptive')
    };

    app.submissions.push(submission);
    saveData();

    showResults(submission);
}

function showResults(submission) {
    document.getElementById('scorePercentage').textContent = submission.percentage + '%';
    document.getElementById('correctAnswers').textContent = submission.correct;
    document.getElementById('incorrectAnswers').textContent = submission.incorrect;
    document.getElementById('totalMarks').textContent = submission.totalMarks;
    document.getElementById('earnedMarks').textContent = submission.earnedMarks;

    // Status message
    let status = 'Excellent!';
    let message = 'Outstanding performance!';
    if (submission.percentage >= 80) {
        status = 'Excellent!';
        message = 'You\'ve demonstrated mastery of the subject!';
    } else if (submission.percentage >= 60) {
        status = 'Good Job!';
        message = 'You\'ve passed with a good score!';
    } else if (submission.percentage >= 40) {
        status = 'Pass';
        message = 'You\'ve passed the examination.';
    } else {
        status = 'Needs Improvement';
        message = 'Keep practicing and you\'ll do better next time!';
    }

    document.getElementById('resultStatus').textContent = status;
    document.getElementById('resultMessage').textContent = message;

    // Performance chart
    const chartContainer = document.getElementById('performanceChart');
    chartContainer.innerHTML = `
                <div class="bar-item">
                    <div class="bar-label">Correct</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${(submission.correct / app.currentExam.questions.length * 100)}%">
                            ${submission.correct}
                        </div>
                    </div>
                </div>
                <div class="bar-item">
                    <div class="bar-label">Incorrect</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${(submission.incorrect / app.currentExam.questions.length * 100)}%; background: var(--gradient-2);">
                            ${submission.incorrect}
                        </div>
                    </div>
                </div>
                <div class="bar-item">
                    <div class="bar-label">Score</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${submission.percentage}%; background: var(--gradient-4);">
                            ${submission.percentage}%
                        </div>
                    </div>
                </div>
                ${submission.tabSwitches > 0 ? `
                    <div class="bar-item">
                        <div class="bar-label">Tab Switches</div>
                        <div class="bar-container">
                            <div class="bar-fill" style="width: ${Math.min(submission.tabSwitches * 10, 100)}%; background: var(--gradient-2);">
                                ${submission.tabSwitches}
                            </div>
                        </div>
                    </div>
                ` : ''}
            `;

    showScreen('resultsScreen');
}

function viewResults(submissionId) {
    const submission = app.submissions.find(s => s.id === submissionId);
    if (submission) {
        app.currentExam = app.exams.find(e => e.id === submission.examId);
        showResults(submission);
    }
}

function backToDashboard() {
    app.currentExam = null;
    app.answers = {};
    if (app.currentUser.role === 'student') {
        loadStudentDashboard();
        showScreen('studentDashboard');
    } else {
        loadTeacherDashboard();
        showScreen('teacherDashboard');
    }
}

// Teacher Functions
function showCreateExamModal() {
    document.getElementById('createExamModal').classList.add('active');
    document.getElementById('questionsBuilder').innerHTML = '';
}

function hideCreateExamModal() {
    document.getElementById('createExamModal').classList.remove('active');
}

let questionCounter = 1;

function addQuestionBuilder() {
    const container = document.getElementById('questionsBuilder');
    const qNum = questionCounter++;

    const builder = document.createElement('div');
    builder.className = 'question-builder';
    builder.innerHTML = `
                <div class="question-builder-header">
                    <h4>Question ${qNum}</h4>
                    <button type="button" class="btn btn-danger" onclick="this.parentElement.parentElement.remove()" style="padding: 8px 16px;">Remove</button>
                </div>
                <div class="form-group">
                    <label>Question Type</label>
                    <select class="question-type-select" onchange="toggleQuestionType(this)">
                        <option value="mcq">Multiple Choice</option>
                        <option value="descriptive">Descriptive</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Question Text</label>
                    <textarea class="question-text-input" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label>Marks</label>
                    <input type="number" class="question-marks-input" min="1" value="5" required>
                </div>
                <div class="mcq-options">
                    <label>Options (select correct answer)</label>
                    <div class="option-inputs">
                        ${[0, 1, 2, 3].map(i => `
                            <div class="option-input-row">
                                <div class="checkbox-custom" onclick="selectCorrectAnswer(this)" data-option="${i}"></div>
                                <input type="text" class="option-input" placeholder="Option ${String.fromCharCode(65 + i)}" required>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
    container.appendChild(builder);
}

function toggleQuestionType(select) {
    const builder = select.closest('.question-builder');
    const mcqOptions = builder.querySelector('.mcq-options');
    mcqOptions.style.display = select.value === 'mcq' ? 'block' : 'none';
}

function selectCorrectAnswer(checkbox) {
    const builder = checkbox.closest('.question-builder');
    builder.querySelectorAll('.checkbox-custom').forEach(cb => cb.classList.remove('checked'));
    checkbox.classList.add('checked');
}

function handleCreateExam(e) {
    e.preventDefault();

    const title = document.getElementById('examTitleInput').value;
    const description = document.getElementById('examDescInput').value;
    const duration = parseInt(document.getElementById('examDuration').value);
    const totalMarks = parseInt(document.getElementById('examMarks').value);

    const questions = [];
    const builders = document.querySelectorAll('.question-builder');

    builders.forEach((builder, index) => {
        const type = builder.querySelector('.question-type-select').value;
        const text = builder.querySelector('.question-text-input').value;
        const marks = parseInt(builder.querySelector('.question-marks-input').value);

        const question = {
            id: index + 1,
            type: type,
            text: text,
            marks: marks
        };

        if (type === 'mcq') {
            const optionInputs = builder.querySelectorAll('.option-input');
            const options = Array.from(optionInputs).map(input => input.value);
            const correctCheckbox = builder.querySelector('.checkbox-custom.checked');
            const correctAnswer = correctCheckbox ? parseInt(correctCheckbox.dataset.option) : 0;

            question.options = options;
            question.correctAnswer = correctAnswer;
        }

        questions.push(question);
    });

    const exam = {
        id: app.exams.length + 1,
        title: title,
        description: description,
        duration: duration,
        totalMarks: totalMarks,
        questions: questions,
        status: 'active',
        createdBy: app.currentUser.username,
        createdAt: new Date().toISOString()
    };

    app.exams.push(exam);
    saveData();

    hideCreateExamModal();
    loadTeacherDashboard();
    alert('Exam created successfully!');
}

function deleteExam(examId) {
    if (confirm('Are you sure you want to delete this exam?')) {
        app.exams = app.exams.filter(e => e.id !== examId);
        saveData();
        loadTeacherDashboard();
    }
}

function showSubmissions() {
    document.getElementById('submissionsModal').classList.add('active');
    loadAllSubmissions();
}

function hideSubmissionsModal() {
    document.getElementById('submissionsModal').classList.remove('active');
}

function viewExamSubmissions(examId) {
    document.getElementById('submissionsModal').classList.add('active');
    loadSubmissionsForExam(examId);
}

function loadAllSubmissions() {
    const container = document.getElementById('submissionsList');
    container.innerHTML = '<h3 style="margin-bottom: 16px;">All Submissions</h3>';

    if (app.submissions.length === 0) {
        container.innerHTML += '<p style="color: var(--text-secondary);">No submissions yet.</p>';
        return;
    }

    app.submissions.forEach(submission => {
        const exam = app.exams.find(e => e.id === submission.examId);
        container.innerHTML += `
                    <div class="exam-card" style="margin-bottom: 16px;">
                        <div class="exam-info">
                            <h4>${exam?.title || 'Unknown Exam'}</h4>
                            <div class="exam-meta">
                                <div class="exam-meta-item">👤 <span>${submission.username}</span></div>
                                <div class="exam-meta-item">📊 <span>${submission.earnedMarks}/${submission.totalMarks}</span></div>
                                <div class="exam-meta-item">✅ <span>${submission.percentage}%</span></div>
                                ${submission.needsManualGrading ? '<div class="exam-meta-item">⏳ <span>Needs Grading</span></div>' : ''}
                            </div>
                        </div>
                        ${submission.needsManualGrading ? `
                            <button class="btn btn-primary" onclick="gradeSubmission(${submission.id})">Grade</button>
                        ` : ''}
                    </div>
                `;
    });
}

function loadSubmissionsForExam(examId) {
    const container = document.getElementById('submissionsList');
    const exam = app.exams.find(e => e.id === examId);
    const submissions = app.submissions.filter(s => s.examId === examId);

    container.innerHTML = `<h3 style="margin-bottom: 16px;">Submissions for: ${exam.title}</h3>`;

    if (submissions.length === 0) {
        container.innerHTML += '<p style="color: var(--text-secondary);">No submissions yet.</p>';
        return;
    }

    submissions.forEach(submission => {
        container.innerHTML += `
                    <div class="exam-card" style="margin-bottom: 16px;">
                        <div class="exam-info">
                            <h4>${submission.username}</h4>
                            <div class="exam-meta">
                                <div class="exam-meta-item">📊 <span>${submission.earnedMarks}/${submission.totalMarks}</span></div>
                                <div class="exam-meta-item">✅ <span>${submission.percentage}%</span></div>
                                <div class="exam-meta-item">🔄 <span>${submission.tabSwitches} switches</span></div>
                                ${submission.needsManualGrading ? '<div class="exam-meta-item">⏳ <span>Needs Grading</span></div>' : ''}
                            </div>
                        </div>
                        ${submission.needsManualGrading ? `
                            <button class="btn btn-primary" onclick="gradeSubmission(${submission.id})">Grade</button>
                        ` : ''}
                    </div>
                `;
    });
}

function gradeSubmission(submissionId) {
    alert('Manual grading interface would open here. This feature allows teachers to evaluate descriptive answers and assign marks.');
}