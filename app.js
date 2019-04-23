// The submit and back buttons
var submit = document.getElementById("submit");
var back = document.getElementById("back");
// The initial and secondary step elements
var initial = document.getElementById("initial");
var secondary = document.getElementById("secondary");
// The first and second input fields
var first = document.getElementById("first_input");
var second = document.getElementById("second_input");
// The area where the first and second input fields go when the second page is initiated
var getFirst = document.getElementById("get_first");
var getSecond = document.getElementById("get_second");
// The outcome fields linked to each input field
var firstOutcome = document.getElementById("first_outcomes");
var secondOutcome = document.getElementById("second_outcomes");

// When the enter button is pressed, click the submit button
window.addEventListener("keypress", e => {
    if(e.keyCode == 13) submit.click();
})

// Continue to the next step if both input fields are complete
function Continue() {
	// If the continue button is pressed and one of the values has been left empty, display the error message.
	if(first.value == "" || second.value == "") {
		var incomplete = document.getElementById("incomplete")
		incomplete.style.display = "block";
		first.addEventListener("keyup", function() {
            if(first.value != "" && second.value != "") incomplete.style.display = "none";
            else incomplete.style.display = "block";
        });
		second.addEventListener("keyup", function() {
            if(first.value != "" && second.value != "") incomplete.style.display = "none";
            else incomplete.style.display = "block";
        });
		return;
	}
	initial.style.display = "none";
    secondary.style.display = "block";
    back.style.visibility = "visible";
    submit.removeEventListener("click", Continue);
    submit.innerHTML = "Done";
    submit.addEventListener("click", Complete);
    getFirst.innerHTML = first.value;
    getSecond.innerHTML = second.value;
}

function Back() {
    back.style.visibility = "hidden";
    initial.style.display = "block";
    secondary.style.display = "none";
    submit.removeEventListener("click", Complete);
    submit.innerHTML = "Continue";
    submit.addEventListener("click", Continue);
}

function addOutcome(origin) {
    /**
     * Each outcome row has each of the following:
     *  - A text area for the outcome
     *  - A number input for the value of the rating
     *  - A select box for either positive or negative
     *  - A button to delete the element
     */
    var node = document.createElement("span");
    var inputArea = document.createElement("input");
    inputArea.type = "text";
    inputArea.placeholder = "Potential outcome here";
    node.appendChild(inputArea);
    var numArea = document.createElement("input");
    numArea.type = "number";
    numArea.placeholder = 50;
    numArea.className = "num";
    numArea.max = 100
    numArea.min = 0;
    var selArea = document.createElement("select");
    var pos = document.createElement("option");
    var neg = document.createElement("option");
    pos.innerHTML = "Positive";
    neg.innerHTML = "Negative";
    pos.value = "pos";
    neg.value = "neg";
    selArea.appendChild(pos);
    selArea.appendChild(neg);
    selArea.className = "sel";
    var del = document.createElement("button");
    del.addEventListener("click", function() {
        node.parentElement.removeChild(node);
    });
    del.innerHTML = "X";
    del.className = "del";
    numArea.addEventListener("keyup", function(event) {
        if(numArea.value < 0) numArea.value = 0;
        if(numArea.value > 100) numArea.value = 100;
        if(event.key == '-') {
            numArea.value = null;
            selArea.value = "neg";
        }
        if(event.key == 'e' || event.key == '.' || event.key == "/") {
            numArea.value = "";
        }
    });
    if(origin == 1) {
        numArea.setAttribute("data-num1", true);
        node.appendChild(numArea);
        selArea.setAttribute("data-sel1", true);
        node.appendChild(selArea);
        node.appendChild(del);
        firstOutcome.appendChild(node);
    }
    else {
        numArea.setAttribute("data-num2", true);
        node.appendChild(numArea);
        selArea.setAttribute("data-sel2", true);
        node.appendChild(selArea);
        node.appendChild(del);
        secondOutcome.appendChild(node);
    }
}

function checkBounds(e, selArea) {
    var numArea = e.target;
    console.log("hereee");
    if(numArea.value < 0) numArea.value = 0;
    if(numArea.value > 100) numArea.value = 100;
    if(e.key == '-') {
        numArea.value = null;
        selArea.value = "neg";
    }
    if(event.key == 'e' || event.key == '.' || event.key == "/") {
        numArea.value = "";
    }
}

// We are done with all of our inputs, so now we need to accumulate all of the values for each decision
// and determine which decision should be made.
// The negative values should be negated to negative values and summed to a final positive score
function Complete() {
    var num1s = document.querySelectorAll('[data-num1]');
    var sel1s = document.querySelectorAll('[data-sel1]');
    var num2s = document.querySelectorAll('[data-num2]');
    var sel2s = document.querySelectorAll('[data-sel2]');
    var finalPositive1 = 0;
    var finalPositive2 = 0;
    for(let i = 0; i < num1s.length; i++) {
        var nextNum = num1s[i].value;
        if(sel1s[i].value == "neg") {
            nextNum *= -1;
        }
        finalPositive1 += Number(nextNum);
    }
    for(let i = 0; i < num2s.length; i++) {
        var nextNum = num2s[i].value;
        if(sel2s[i].value == "neg") {
            nextNum *= -1;
        }
        finalPositive2 += Number(nextNum);
    }
    back.style.visibility = "hidden";
    secondary.style.display = "none";
    submit.removeEventListener("click", Complete);
    submit.innerHTML = "Start again";
    submit.addEventListener("click", reset);
    var answer = document.getElementById("answer");
    document.getElementsByTagName("header")[0].innerHTML = "You Moral Dilemma Has Been Solved!";
    answer.style.display = "block";
    document.getElementById("info").style.visibility = "visible";
    if(finalPositive1 > finalPositive2) {
        answer.innerHTML = "I should " + first.value;
    }
    else {
        answer.innerHTML = "I should " + second.value;
    }
}

function reset() {
    sessionStorage.clear()
    localStorage.clear();
    window.location.reload(true);
}