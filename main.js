var test = HSK1;
var words = test[0];
var answers = test[1];
var incompleted = []
var testLength = words.length;
var start = 1;
var end = testLength;
var correct = 0;
var skipped = 0;
var seen = 0;
var checked = false;
var sawAnswer = false;
var message;
var word = 0;

retake = [[],[]];
customWords = [[],[],""];

window.onload = function() {
    startTest();

    document.getElementById("answer").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.key === 'Enter'){
            if (checked == false){
                checkWord();
            } else {
                nextWord();
            }
        }
    });
    document.getElementById("uploadTest").addEventListener("change", function(event) {
        fullPath = document.getElementById("uploadTest").value;
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        document.getElementById("uploadButton").innerHTML = filename;
    });
}

function loadTest(){
    // clicked Go!
    if (document.getElementById("selectTest").value != "None"){
        test = testDict[document.getElementById("selectTest").value];
        start = document.getElementById("testStart").value;
        end = document.getElementById("testEnd").value;
        if (!checkRange()) return;
        testLength = end-start+1;
        words = test[0];
        answers = test[1];
        startTest();
    } else if (document.getElementById("uploadTest").value != "") {
        fullPath = document.getElementById("uploadTest").value;
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        test = [[], [], ""];
        test[2] = filename.slice(0, -4);
        var fileInput = document.getElementById("uploadTest");
        let file = fileInput.files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function() {
            let x = reader.result.trim().split("\n");
            for (let i = 0; i < x.length; i++){
                var seperated = x[i].split(/[ ,]+/);
                test[0][i] = seperated[0].trim();
                test[1][i] = seperated[1].trim();
            }
            start = document.getElementById("testStart").value;
            end = document.getElementById("testEnd").value;
            if (!checkRange()) return;
            testLength = end-start+1;
            words = test[0];
            answers = test[1];
            startTest();
        }
    }
}

function checkRange(){
    if (start == "") {
        start = 1;
    }
    if (end == "") {
        end = words.length;
    }

    if (start <= 0) {
        alert("Start value must be bigger than or equal to 1.");
        return false;
    }
    if (end > words.length) {
        alert("End is too large, list is not that long.");
        return false;
    }
    if (start > end) {
        alert("Start must be bigger than or equal to end.");
        return false;
    }
    return true;
}

function startTest(){
    // start new test
    checked = false;
    sawAnswer = false;
    correct = 0;
    skipped = 0;
    seen = 0;
    retake = [[],[]];
    incompleted = [];
    word = -1;
    for (let i = start-1; i < end; i++){
        incompleted.push(i);
    }
    seen = 0;
    document.getElementById("retake").style.display = "none";
    document.getElementById("title").innerHTML = test[2] + " (" + start + "-" + end + ")";
    document.getElementById("progress").innerHTML = seen + " out of " + testLength; 
    nextWord();
    document.getElementById("accuracyDisplay").innerHTML = "0% Correct so far"; 
    document.getElementById("answerDiv").style.display = "flex";
}

function nextWord(){
    // load next word
    checked = false;
    sawAnswer = false;

    if (word > -1){
        incompleted.splice(word, 1);
    }

    if (incompleted.length == 0) {
        finishTest();
        return;
    }
    word = Math.floor(Math.random()*incompleted.length);
    document.getElementById("answer").value = "";
    document.getElementById("showAnswerButton").style.display = "none";
    document.getElementById("nextQuestionButton").style.display = "none";
    document.getElementById("submitAnswerButton").style.display = "inline-block";
    document.getElementById("mark").style.visibility = "hidden";

    seen += 1;
    document.getElementById("progress").innerHTML = seen + " out of " + testLength;
    document.getElementById("correctDisplay").innerHTML = correct + " Correct";
    document.getElementById("skippedDisplay").innerHTML = skipped + " Skipped";
    document.getElementById("accuracyDisplay").innerHTML = Math.floor(100*(correct/(seen-1))) + "% Correct so far"; 
    document.getElementById("characters").innerHTML = words[incompleted[word]];
}

function checkWord(){
    // clicked submit or pressed enter
    ans = document.getElementById("answer").value.toLowerCase().trim();
    document.getElementById("mark").style.visibility = "visible";
    if (ans == answers[incompleted[word]]) {
        // correct
        if (checked == false) {
            correct += 1;
        }
        checked = true;
        document.getElementById("submitAnswerButton").style.display = "none";
        document.getElementById("showAnswerButton").style.display = "none";
        document.getElementById("nextQuestionButton").style.display = "inline-block";
        document.getElementById("mark").innerHTML = "Correct!";
    } else {
        // incorrect
        document.getElementById("showAnswerButton").style.display = "inline-block";
        document.getElementById("mark").innerHTML = "Incorrect";
    }
}

function checkAnswer(){
    // clicked answer
    document.getElementById("mark").innerHTML = answers[incompleted[word]];
    document.getElementById("mark").style.visibility = "visible";
    document.getElementById("showAnswerButton").style.display = "none";
    document.getElementById("submitAnswerButton").style.display = "none";
    document.getElementById("nextQuestionButton").style.display = "inline-block";

    sawAnswer = true;
    skipped += 1;

    retake[0].push(words[incompleted[word]]);
    retake[1].push(answers[incompleted[word]]);
}

function finishTest(){
    // finished test
    document.getElementById("characters").innerHTML = "You Finished!";
    document.getElementById("mark").style.visibility = "hidden";
    document.getElementById("accuracyDisplay").innerHTML = Math.floor(100*(correct/seen)) + "% Correct"; 
    document.getElementById("correctDisplay").innerHTML = correct + " Correct";
    document.getElementById("skippedDisplay").innerHTML = skipped + " Skipped";
    document.getElementById("answerDiv").style.display = "none";

    if (retake[0].length > 0){
        document.getElementById("retake").style.display = "inline-block";
    }
}

function retakeTest(){
    words = retake[0];
    answers = retake[1];
    start = 1;
    end = retake[0].length;
    startTest();
}

function toggleHelp(){
    if (document.getElementById("helpModal").style.visibility == "hidden"){
        document.getElementById("helpModal").style.visibility = "visible"
    } else {
        document.getElementById("helpModal").style.visibility = "hidden";
    }
}