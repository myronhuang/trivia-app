//variables

const URL = "https://opentdb.com/api.php?amount=1";

let question = document.getElementById("question");
let nextQuestion = document.getElementById("new-question-button-wrapper");
let options = [...document.querySelectorAll(".option")];
let optionContainer = document.getElementsByClassName("optionContainer");
let option_containers = [...document.querySelectorAll(".option-container")];

let answerArray = [];

let correctAnswer;
let incorrectAnswers;

nextQuestion.addEventListener("click", getNextQuestion);

nextQuestion.addEventListener("mousedown", () => {
  nextQuestion.children[0].src = './assets/next-question-button-pressed.svg';
  nextQuestion.children[1].classList.add('pushed');
});

nextQuestion.addEventListener("mouseup", () => {
  nextQuestion.children[0].src = './assets/next-question-button.svg';
  nextQuestion.children[1].classList.remove('pushed');
});

option_containers.forEach(container => {
  container.addEventListener("mousedown", () => {
    container.children[0].src = "./assets/button-pressed.svg";
    container.children[1].classList.add("pressed");
  });

  container.addEventListener("mouseup", () => {
    container.children[0].src = "./assets/answer-box.svg";
    container.children[1].classList.remove("pressed");
  });
});

//get and set up questions and answers
getQA();
setupOptions();

function getNextQuestion() {

  //remove any selectable-answer classes, hide all divs
  for(let i = 0; i < options.length; i++){
    option_containers[i].children[0].src = "./assets/answer-box.svg";
    option_containers[i].classList.remove("selectable-answer");
    option_containers[i].classList.remove("incorrect");
    option_containers[i].classList.remove("correct");
    option_containers[i].classList.add("hidden");
  }

  getQA();
}

function getQA() {

  axios.get(URL)
  .then(function(res){

    //get correct answer
    correctAnswer = res.data.results[0].correct_answer;
    //get incorrect answers
    incorrectAnswers = res.data.results[0].incorrect_answers;
    //display question
    question.innerHTML = res.data.results[0].question;
    //populate answer Array with correct and incorrect answers
    answerArray = [correctAnswer, ...incorrectAnswers];
    console.log(correctAnswer);
    //shuffle order of answerrs in answer array
    shuffleArray(answerArray);
    //loop through option divs
    for(let i = 0; i < answerArray.length; i++) {

        //remove hidden class and add selectable-answer class, make divs visible
        option_containers[i].classList.remove("hidden");
        option_containers[i].classList.add("selectable-answer");
        options[i].innerHTML = answerArray[i];

    }
     
  })
  .catch(function(err){
    console.log(err);
  })
}

//shuffle array
function shuffleArray(arr) {
  arr.sort(function() { return 0.5 - Math.random() });
}

function setupOptions() {
  for(var i = 0; i < options.length; i++) {
    option_containers[i].addEventListener("click", function(){
      //chosen answer is the option that the user clicks on
      let chosenAnswer = this.innerText;

      console.log(chosenAnswer); //for debugging

      //see if chosen answer is equal to correct answer
      if(chosenAnswer === correctAnswer) {

        //if chosen answer is equal to correct answer, add correct class
        this.classList.add("correct");

        //change button image to correct button
        this.children[0].src = "./assets/button-correct.svg";
        //if answer is correct, disable all of the incorrect answers by adding an incorrect class
        option_containers.forEach(option => {

          if(option.innerText !== correctAnswer) {
            option.classList.add('incorrect');
          }
        });
              
      } else {
        //if chosen answer is not correct, add incorrect class to chosen answer
        this.classList.add('incorrect');
      }
    })
  }
}
