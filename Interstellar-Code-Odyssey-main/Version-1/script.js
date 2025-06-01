const challenges = [
    { error: "for (int i = 0 i < 5; i++) {", solution: "for (int i = 0; i < 5; i++) {" },
    { error: "gravity = mass * velocity;", solution: "gravity = mass * acceleration;" },
    { error: "response.status_code = 200;", solution: "response.status_code == 200;" }
];

let currentChallenge = 0;

function loadChallenge() {
    document.getElementById("errorText").innerText = challenges[currentChallenge].error;
    document.getElementById("result").innerText = "";
    document.getElementById("userInput").value = "";
}

function checkAnswer() {
    let userCode = document.getElementById("userInput").value.trim();
    let correctCode = challenges[currentChallenge].solution;

    if (userCode === correctCode) {
        document.getElementById("result").innerHTML = "✅ Code Fixed! Space anomaly stabilized!";
        currentChallenge++;
        if (currentChallenge < challenges.length) {
            setTimeout(loadChallenge, 1500);
        } else {
            document.getElementById("result").innerHTML = "🎉 All anomalies stabilized! You win!";
        }
    } else {
        document.getElementById("result").innerHTML = "❌ Error! Try again.";
        document.getElementById("errorText").classList.add("glitch");
        setTimeout(() => document.getElementById("errorText").classList.remove("glitch"), 300);
    }
}

// Load the first challenge
loadChallenge();