let hasFired = false;

function checkForSubmission() {
    if (hasFired) return;

    let currentUrl = window.location.href;

    // website check
    if (!currentUrl.toLowerCase().includes("brightspace")) return;

    const bodyText = document.body.innerText.toLowerCase();

    const successPhrases = [
        "file submission successful",
        "submission successful",
        "confirmation of submission",
        "submitted successfully",
        "submission receipt"
    ];

    const foundPhrase = successPhrases.find(phrase => bodyText.includes(phrase));

    if (foundPhrase) {
        fireConfettiAndSound();
        hasFired = true;
    }
}

function fireConfettiAndSound() {

    // play sound
    try {
        const audioUrl = chrome.runtime.getURL('success.mp3');
        const audio = new Audio(audioUrl);
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio waiting for interaction:", e));
    } catch (e) {
        console.error("Audio error:", e);
    }

    // play confetti
    if (typeof confetti === 'function') {
        var duration = 3 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        function randomInRange(min, max) { return Math.random() * (max - min) + min; }

        var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            var particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }
}

// watch for page updates
const observer = new MutationObserver((mutations) => {
    checkForSubmission();
});

observer.observe(document.body, { childList: true, subtree: true });

// run once immediately on page load
checkForSubmission();

// manual trigger
document.addEventListener('keydown', (event) => {
    if (event.shiftKey && event.key.toLowerCase() === 'c') {
        console.log("Manual override activated.");
        hasFired = false;
        fireConfettiAndSound();
    }
});
