const D2L_KEYWORDS = ['brightspace', 'd2l', 'view_submission', 'submit'];

// prevent double confetti
let hasFired = false;

function fireConfettiAndSound() {
    if (hasFired) return;
    hasFired = true;

    // sound
    const audioUrl = chrome.runtime.getURL('success.mp3');
    const audio = new Audio(audioUrl);
    audio.volume = 0.5; // Adjust volume (0.0 to 1.0)
    audio.play().catch(e => console.log("Audio blocked until interaction:", e));

    // confetti
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);

      // specific confetti settings
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    console.log("Brightspace Assignment Submitted: Confetti deployed!");
}

function checkForSubmission() {
    // brightspace check
    const currentUrl = window.location.href;
    const isBrightspace = D2L_KEYWORDS.some(k => currentUrl.includes(k));

    const bodyText = document.body.innerText;

    const successPhrases = [
        "File submission successful",
        "Submission Successful", 
        "Confirmation of Submission"
    ];

    if (isBrightspace && successPhrases.some(phrase => bodyText.includes(phrase))) {
        fireConfettiAndSound();
    }
}

// page load
checkForSubmission();

// run continuously
const observer = new MutationObserver((mutations) => {
    checkForSubmission();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
