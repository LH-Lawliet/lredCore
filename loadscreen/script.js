window.addEventListener('DOMContentLoaded', () => {
    window.nuiHandoverData = window.nuiHandoverData || {}
    console.log(`You are connecting to ${window.nuiHandoverData.serverAddress || "no adress"}`);
    // a thing to note is the use of innerText, not innerHTML: names are user input and could contain bad HTML!
    document.querySelector('#playerName').innerText = window.nuiHandoverData.name || "NO NAME";
});