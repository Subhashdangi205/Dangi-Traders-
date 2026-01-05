// welcome.js
document.addEventListener('DOMContentLoaded', function() {
    // User ka name input ya data attribute se nikalne ke liye
    const userName = document.getElementById('user-data').dataset.username;
    
    if (!userName || userName === "AnonymousUser") return;

    const welcomeMessage = ` jay shree ram ,${userName} aapka Dangi Traders mein swagat he`;

    function speakWelcome() {
        if ('speechSynthesis' in window) {
            // Agar pehle se kuch bol raha hai toh stop karein
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(welcomeMessage);
            utterance.lang = 'hi-IN'; 
            utterance.pitch = 1.1;    
            utterance.rate = 0.85; // Thoda aur natural rakha hai speed ko
            
            window.speechSynthesis.speak(utterance);
        }
    }

    // Browser policy: Pehla click hone par hi audio chalega
    document.body.addEventListener('click', function() {
        speakWelcome();
    }, { once: true });
});