// Global Variables
let awarenessScore = 0;
let bruteForceRunning = false;

// Phishing Email Templates
const phishingTemplates = {
    bank: {
        from: "security@paypa1-alert.com",
        subject: "URGENT: Verify Your Account Now",
        body: `Dear Valued Customer,

We have detected suspicious activity on your account. Your account will be suspended within 24 hours unless you verify your information immediately.

Click here to verify: <span class="suspicious-link">http://paypa1-verify.com/update</span>

This is an automated message. Please do not reply.

Best regards,
PayPal Security Team`,
        redFlags: ["Urgent language", "Suspicious sender domain (paypa1 instead of paypal)", "Threatening account suspension", "Suspicious URL", "Generic greeting"]
    },
    prize: {
        from: "winner@international-lottery.org",
        subject: "Congratulations! You've Won $1,000,000!",
        body: `Dear Lucky Winner,

Congratulations! Your email has been randomly selected in our International Lottery Program. You have won $1,000,000 USD!

To claim your prize, please provide:
- Full Name
- Bank Account Details
- Social Security Number

Click here to claim: <span class="suspicious-link">http://claim-prize-now.ru/winner</span>

Act fast! This offer expires in 48 hours.

International Lottery Commission`,
        redFlags: ["Too good to be true", "Requesting sensitive information", "Creates urgency", "Suspicious domain (.ru)", "Unsolicited prize notification"]
    },
    security: {
        from: "no-reply@microsoft-security.net",
        subject: "Security Alert: Unusual Sign-in Activity",
        body: `Microsoft Account Security

We detected an unusual sign-in attempt to your account from:
Location: Unknown
Device: Unknown
Time: 2 hours ago

If this wasn't you, please secure your account immediately by clicking below:
<span class="suspicious-link">http://microsoft-secure-login.com/verify</span>

If you don't act within 12 hours, your account may be compromised.

Microsoft Security Team`,
        redFlags: ["Creates panic", "Fake domain (not microsoft.com)", "Vague details", "Urgent deadline", "Suspicious link"]
    },
    delivery: {
        from: "delivery@fedex-delivery.net",
        subject: "Package Delivery Failed - Action Required",
        body: `FedEx Delivery Notification

We attempted to deliver your package but nobody was home.

Tracking #: FX1234567890
Status: Awaiting Redelivery

To reschedule delivery, please confirm your address and pay the redelivery fee of $3.99:
<span class="suspicious-link">http://fedex-redelivery.com/confirm</span>

Your package will be returned to sender if not claimed within 3 days.

FedEx Customer Service`,
        redFlags: ["Unexpected package notification", "Requesting payment for redelivery", "Suspicious domain", "Creating urgency", "Fake tracking number"]
    }
};

// Initialize
function init() {
    loadPhishingEmail();
    updateScore();
}

// Tab Navigation
function showTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected section
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
}

// Phishing Email Functions
function loadPhishingEmail() {
    const scenario = document.getElementById('emailScenario').value;
    const template = phishingTemplates[scenario];

    const emailHTML = `
                <div class="email-header">
                    <div class="email-field"><strong>From:</strong> ${template.from}</div>
                    <div class="email-field"><strong>Subject:</strong> ${template.subject}</div>
                    <div class="email-field"><strong>Date:</strong> ${new Date().toLocaleString()}</div>
                </div>
                <div class="email-body">${template.body.replace(/\n/g, '<br>')}</div>
            `;

    document.getElementById('emailPreview').innerHTML = emailHTML;
    document.getElementById('phishingResult').innerHTML = '';
}

function analyzePhishingEmail() {
    const scenario = document.getElementById('emailScenario').value;
    const template = phishingTemplates[scenario];

    let resultHTML = '<div class="alert alert-danger" style="margin-top: 20px;">';
    resultHTML += '<strong>⚠️ PHISHING DETECTED!</strong><br><br>';
    resultHTML += '<strong>Red Flags Identified:</strong><br>';

    template.redFlags.forEach(flag => {
        resultHTML += `• ${flag}<br>`;
    });

    resultHTML += '</div>';

    resultHTML += '<div class="alert alert-success" style="margin-top: 15px;">';
    resultHTML += '<strong>✓ Great job identifying this phishing attempt! +20 points</strong>';
    resultHTML += '</div>';

    document.getElementById('phishingResult').innerHTML = resultHTML;

    awarenessScore = Math.min(awarenessScore + 20, 100);
    updateScore();
}

// Password Analyzer Functions
function analyzePassword() {
    const password = document.getElementById('passwordInput').value;

    if (!password) {
        document.getElementById('strengthBar').style.width = '0%';
        document.getElementById('strengthText').textContent = '';
        document.getElementById('passwordChecks').innerHTML = '';
        return;
    }

    // Calculate strength
    let strength = 0;
    const checks = {
        length: password.length >= 12,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        noCommon: !['password', '123456', 'qwerty', 'abc123', 'password123'].includes(password.toLowerCase())
    };

    let passedChecks = 0;
    Object.values(checks).forEach(check => {
        if (check) passedChecks++;
    });

    strength = (passedChecks / 6) * 100;

    // Update strength bar
    const strengthBar = document.getElementById('strengthBar');
    strengthBar.style.width = strength + '%';

    let color, text;
    if (strength < 33) {
        color = '#ff3366';
        text = 'Weak - Easily Cracked';
    } else if (strength < 66) {
        color = '#ffcc00';
        text = 'Medium - Could Be Better';
    } else {
        color = '#00ff41';
        text = 'Strong - Good Security';
    }

    strengthBar.style.background = color;
    document.getElementById('strengthText').textContent = text;
    document.getElementById('strengthText').style.color = color;

    // Display checks
    let checksHTML = '';
    checksHTML += `<div class="info-item ${checks.length ? 'pass' : 'fail'}">
                ${checks.length ? '✓' : '✗'} Length (12+ characters)
            </div>`;
    checksHTML += `<div class="info-item ${checks.uppercase ? 'pass' : 'fail'}">
                ${checks.uppercase ? '✓' : '✗'} Uppercase Letters
            </div>`;
    checksHTML += `<div class="info-item ${checks.lowercase ? 'pass' : 'fail'}">
                ${checks.lowercase ? '✓' : '✗'} Lowercase Letters
            </div>`;
    checksHTML += `<div class="info-item ${checks.numbers ? 'pass' : 'fail'}">
                ${checks.numbers ? '✓' : '✗'} Numbers
            </div>`;
    checksHTML += `<div class="info-item ${checks.special ? 'pass' : 'fail'}">
                ${checks.special ? '✓' : '✗'} Special Characters
            </div>`;
    checksHTML += `<div class="info-item ${checks.noCommon ? 'pass' : 'fail'}">
                ${checks.noCommon ? '✓' : '✗'} Not a Common Password
            </div>`;

    document.getElementById('passwordChecks').innerHTML = checksHTML;

    // Update score
    if (strength >= 66 && awarenessScore < 100) {
        awarenessScore = Math.min(awarenessScore + 5, 100);
        updateScore();
    }
}

// Brute Force Functions
function startBruteForce() {
    if (bruteForceRunning) {
        bruteForceRunning = false;
        document.getElementById('bruteBtn').textContent = '⚡ Start Attack Simulation';
        return;
    }

    const target = document.getElementById('bruteTarget').value;
    if (!target) {
        alert('Please enter a target password');
        return;
    }

    bruteForceRunning = true;
    document.getElementById('bruteBtn').textContent = '⏸️ Stop Simulation';
    document.getElementById('bruteProgress').style.display = 'block';
    document.getElementById('bruteConsole').innerHTML = '<div class="console-line">[*] Initializing brute force attack...</div>';

    const speed = parseInt(document.getElementById('bruteSpeed').value);
    const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let attempts = 0;
    const maxAttempts = 1000;

    function tryPassword() {
        if (!bruteForceRunning || attempts >= maxAttempts) {
            if (attempts >= maxAttempts) {
                addConsoleMessage('[!] Maximum attempts reached. Target not found.');
            }
            bruteForceRunning = false;
            document.getElementById('bruteBtn').textContent = '⚡ Start Attack Simulation';
            return;
        }

        attempts++;
        const guess = generateRandomString(target.length, charset);
        const progress = (attempts / maxAttempts) * 100;

        document.getElementById('bruteProgressFill').style.width = progress + '%';
        document.getElementById('bruteProgressFill').textContent = Math.round(progress) + '%';

        if (guess === target) {
            addConsoleMessage(`[+] PASSWORD FOUND: "${guess}" after ${attempts} attempts!`);
            addConsoleMessage(`[*] Time elapsed: ${(attempts * speed / 1000).toFixed(2)} seconds`);
            addConsoleMessage(`[!] This demonstrates why strong passwords are important.`);
            bruteForceRunning = false;
            document.getElementById('bruteBtn').textContent = '⚡ Start Attack Simulation';

            awarenessScore = Math.min(awarenessScore + 15, 100);
            updateScore();
        } else {
            if (attempts % 50 === 0) {
                addConsoleMessage(`[-] Trying: "${guess}" (Attempt ${attempts}/${maxAttempts})`);
            }
            setTimeout(tryPassword, speed);
        }
    }

    tryPassword();
}

function generateRandomString(length, charset) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
}

function addConsoleMessage(message) {
    const console = document.getElementById('bruteConsole');
    const line = document.createElement('div');
    line.className = 'console-line';
    line.textContent = message;
    console.appendChild(line);
    console.scrollTop = console.scrollHeight;
}

// XSS Demo Functions
function testXSS() {
    const input = document.getElementById('xssInput').value;

    if (!input) {
        alert('Please enter some input to test');
        return;
    }

    // Check for XSS patterns
    const xssPatterns = [
        /<script/i,
        /javascript:/i,
        /onerror=/i,
        /onload=/i,
        /<iframe/i,
        /eval\(/i
    ];

    let isXSS = false;
    xssPatterns.forEach(pattern => {
        if (pattern.test(input)) {
            isXSS = true;
        }
    });

    const sanitized = sanitizeInput(input);

    let resultHTML = '';
    if (isXSS) {
        resultHTML += '<div class="alert alert-danger" style="margin-top: 20px;">';
        resultHTML += '<strong>⚠️ XSS ATTACK DETECTED!</strong><br><br>';
        resultHTML += `<strong>Original Input:</strong><br><code style="color: var(--danger-red);">${escapeHtml(input)}</code><br><br>`;
        resultHTML += `<strong>Sanitized Output:</strong><br><code style="color: var(--primary-green);">${escapeHtml(sanitized)}</code><br><br>`;
        resultHTML += 'The malicious script has been neutralized through input sanitization.';
        resultHTML += '</div>';

        awarenessScore = Math.min(awarenessScore + 15, 100);
        updateScore();
    } else {
        resultHTML += '<div class="alert alert-success" style="margin-top: 20px;">';
        resultHTML += '<strong>✓ SAFE INPUT</strong><br><br>';
        resultHTML += `<strong>Output:</strong><br><code>${escapeHtml(sanitized)}</code><br><br>`;
        resultHTML += 'No XSS patterns detected. Input is safe.';
        resultHTML += '</div>';
    }

    document.getElementById('xssResult').innerHTML = resultHTML;
}

function sanitizeInput(input) {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// SQL Injection Functions
function testSQLInjection() {
    const username = document.getElementById('sqlUsername').value;
    const password = document.getElementById('sqlPassword').value;

    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }

    const console = document.getElementById('sqlConsole');
    console.innerHTML = '<div class="console-line">[*] Testing SQL injection vulnerability...</div>';

    // Check for SQL injection patterns
    const sqlPatterns = [
        /'\s*OR\s*'1'\s*=\s*'1/i,
        /--/,
        /;/,
        /UNION/i,
        /SELECT/i,
        /DROP/i,
        /INSERT/i,
        /UPDATE/i,
        /DELETE/i
    ];

    let isSQLInjection = false;
    sqlPatterns.forEach(pattern => {
        if (pattern.test(username) || pattern.test(password)) {
            isSQLInjection = true;
        }
    });

    setTimeout(() => {
        addSQLMessage('[*] Building SQL query...');
    }, 500);

    setTimeout(() => {
        if (isSQLInjection) {
            addSQLMessage(`[!] VULNERABLE QUERY: SELECT * FROM users WHERE username='${username}' AND password='${password}'`);
            addSQLMessage('[!] SQL INJECTION DETECTED!');
            addSQLMessage('[*] The query structure has been manipulated.');
            addSQLMessage('[*] In a real system, this could bypass authentication.');

            let resultHTML = '<div class="alert alert-danger" style="margin-top: 20px;">';
            resultHTML += '<strong>⚠️ SQL INJECTION DETECTED!</strong><br><br>';
            resultHTML += 'The input contains SQL injection patterns that could manipulate database queries.<br>';
            resultHTML += '<strong>Use prepared statements to prevent this!</strong>';
            resultHTML += '</div>';
            document.getElementById('sqlResult').innerHTML = resultHTML;

            awarenessScore = Math.min(awarenessScore + 15, 100);
            updateScore();
        } else {
            addSQLMessage('[*] SECURE QUERY: Using prepared statement');
            addSQLMessage('[*] Parameters bound safely');
            addSQLMessage('[+] Query executed successfully');
            addSQLMessage('[*] No SQL injection detected.');

            let resultHTML = '<div class="alert alert-success" style="margin-top: 20px;">';
            resultHTML += '<strong>✓ SAFE INPUT</strong><br>';
            resultHTML += 'No SQL injection patterns detected. The query would be executed safely.';
            resultHTML += '</div>';
            document.getElementById('sqlResult').innerHTML = resultHTML;
        }
    }, 1000);
}

function addSQLMessage(message) {
    const console = document.getElementById('sqlConsole');
    const line = document.createElement('div');
    line.className = 'console-line';
    line.textContent = message;
    console.appendChild(line);
    console.scrollTop = console.scrollHeight;
}

// Score Update
function updateScore() {
    document.getElementById('totalScore').textContent = awarenessScore;

    // Save to localStorage
    localStorage.setItem('cyberSecAwarenessScore', awarenessScore);
}

// Load saved score
window.addEventListener('load', () => {
    const savedScore = localStorage.getItem('cyberSecAwarenessScore');
    if (savedScore) {
        awarenessScore = parseInt(savedScore);
        updateScore();
    }
    init();
});