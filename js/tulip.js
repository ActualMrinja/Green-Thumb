var date = new Date();

//Loads user
var name = undefined;
chrome.storage.local.get(["user"], function(result) {
    greet(result.user)
});

var text = "";
var typewrite = 0;

var question = -1;
var response = "";
var voices = [new Audio("sounds/laugh01.mp3"), new Audio("sounds/laugh02.mp3"), new Audio("sounds/laugh03.mp3"), new Audio("sounds/hm04.mp3")];

var mode = "Seed";
var frame = 0;

//Greets user and switches to talk
function greet(result) {
    if (result !== undefined) {
        name = result;
        text = (date.getHours() <= 4 || date.getHours() >= 21 ? "Good night" : date.getHours() >= 12 ? "Good afternoon" : "Good morning") + ", " + name.substring(0, 10) + "! I am thirsty.";
        mode = "Talk";
    }
}

//Grows tulip and makes it talk
function talk() {
    if (mode == "Seed") {
        mode = "Grow";
    } else if (mode == "Grow") {
        mode = "Flower";
        speak.innerHTML = "What should I call you?";
    } else if (mode == "Idle") {
        question = Math.floor(Math.random() * questions.length);
        text = questions[question][0];
        text = text.split("(name)").join(name.substring(0, 10));
        typewrite = 0;
        document.getElementById("talk").value = "";
    }
}

//Names user and makes it respond
function respond() {
    if (mode == "Flower" && document.getElementById("talk").value !== "") {
        chrome.storage.local.set({
            user: document.getElementById("talk").value
        });
        chrome.storage.local.get(["user"], function(result) {
            greet(result.user)
        });
    } else if (question >= 0 && document.getElementById("talk").value !== "") {
        response = document.getElementById("talk").value;
        text = questions[question][1];
        text = text.split("(response)").join(response.substring(0, 20));
        typewrite = 0;

        question = -1;
    }
}

//Animates tulip and words
function animate() {
    frame += 8;

    if (frame > 60) {
        frame = 0
    }

    document.getElementById("tulip").src = "tulips/tulip" + mode + (frame > 30 ? "1" : "0") + ".svg";


    if (typewrite < text.length) {
        mode = "Talk";
        typewrite += 1.5;
        speak.innerHTML = text.substring(0, typewrite);
        voices[Math.floor(Math.random() * 3)].play();
    } else if (mode == "Talk") {
        mode = "Idle";
    }

}
setInterval(animate, 1000 / 30);
document.getElementById("water").onclick = talk;
document.getElementById("submit").onclick = respond;