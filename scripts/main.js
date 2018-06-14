(function($) {

  /**
   * Data - quiz questions
   */

  const data = [
    {
      prompt: 'Where is Cloud City located?',
      options: [
        'Habogad',
        'Bespin',
        'Kashyyyk',
        'Dagobah'
      ],
      correctIndex: 1
    },
    {
      prompt: 'How many years did Yoda train jedi?',
      options: [
        '900',
        '700',
        '800',
        '850'
      ],
      correctIndex: 2
    },
    {
      prompt: 'What kind of speeder did Luke own on Tatooine?',
      options: [
        'LT-28',
        'AT-16 Skyhopper',
        'AL-17 Skyhopper',
        'T-23 Skyhopper'
      ],
      correctIndex: 1
    }
  ];

  /**
   * Question - model attributes associated with a question
   */

  function Question(datum) {
    this.prompt = datum.prompt;
    this.options = datum.options;
    this.correctIndex = datum.correctIndex;
  }

  /**
   * Quiz - maintain quiz state (i.e. correct number of responses)
   */

  function Quiz(data) {
    this.correctCounter = 0;
    this.points = 0;
    this.counter = 0;
    this.questions = [];
    this.addQuestions(data);
  }

  Quiz.prototype.addQuestions = function(data) {
    data.forEach(datum => {
      this.questions.push(new Question(datum));
    });
  };

  Quiz.prototype.nextQuestion = function(selection) {
    if (this.currQuestion && this.currQuestion.correctIndex === selection) {
      this.correctCounter++;
    }

    this.currQuestion = this.questions[this.counter++]

    return this.currQuestion;
  };

  /**
   * Quiz App - manage the quiz (e.g. start/stop)
   */

  function QuizApp(data) {
    this.data = data;
    this.quizIntro = new QuizIntro('.quiz-intro', this);
    this.quizMain = new QuizMain('.quiz-main', this);
    this.quizSummary = new QuizReview('.quiz-summary', this);
    this.quizIntro.addEventListeners();
    this.quizMain.addEventListeners();
    this.quizSummary.addEventListeners();
  }

  QuizApp.prototype.startQuiz = function() {
    this.quiz = new Quiz(this.data);
    this.quizIntro.toggleDisplay(true);
    this.quizMain.toggleDisplay(false);
    this.nextQuestion();
  };

  QuizApp.prototype.stopQuiz = function() {
    this.quizMain.toggleDisplay(true);
    this.quizSummary.toggleDisplay(false);
    this.quizSummary.displayResults(this.quiz.correctCounter);
  };

  QuizApp.prototype.restartQuiz = function() {
    this.quizSummary.toggleDisplay(true);
    this.quizIntro.toggleDisplay(false);

    this.quiz.correctCounter = 0;
    this.quiz.counter = 0;
  }

  QuizApp.prototype.nextQuestion = function(selectedOption) {
    const currQuestion = this.quiz.nextQuestion(selectedOption);

    if (currQuestion) {
      this.quizMain.setQuestion(currQuestion);
    } else {
      this.stopQuiz();
    }
  };

  /**
   * Quiz Intro - intro display management
   */

  function QuizIntro(selector, quizApp) {
    this.element = $(selector);
    this.startButton = this.element.find('.start-btn');
    this.quizApp = quizApp;
  }

  QuizIntro.prototype.addEventListeners = function() {
    this.startButton.click(() => {
      this.quizApp.startQuiz();
    });
  };

  QuizIntro.prototype.toggleDisplay = function(state) {
    this.element.toggleClass('hidden', state);
  };

  /**
   * Quiz Main - question display management
   */

  function QuizMain(selector, quizApp) {
    this.element = $(selector);
    this.submitButton = this.element.find('.submit-btn');
    this.quizApp = quizApp;
  }

  QuizMain.prototype.addEventListeners = function() {
    this.submitButton.click(() => {
      const selectedOption = parseInt(this.element.find('.answers-container ul input[name="options"]:checked').val());
      this.quizApp.nextQuestion(selectedOption);
    });
  };

  QuizMain.prototype.setQuestion = function(currQuestion) {
    let answers = '';

    this.element.find('.question-container').html(currQuestion.prompt);

    const questionsContainer = this.element.find('.answers-container ul');

    currQuestion.options.forEach((option, idx) => {
      answers += `
        <li>
          <input type="radio" name="options" class="radio" value="${idx}" /> ${option}
        </li>
      `;
    });

    questionsContainer.html(answers);
  };

  QuizMain.prototype.toggleDisplay = function(state) {
    this.element.toggleClass('hidden', state);
  };

  /**
   * Quiz Review - question review management
   */

  function QuizReview(selector, quizApp) {
    this.element = $(selector);
    this.restartButton = this.element.find('.restart-btn');
    this.quizApp = quizApp;
  }

  QuizReview.prototype.toggleDisplay = function(state) {
    this.element.toggleClass('hidden', state);
  };

  QuizReview.prototype.displayResults = function(results) {
    this.element.find('.results-container').html(`${results} questions correct`);
  };

  QuizReview.prototype.addEventListeners = function() {
    this.restartButton.click(() => {
      this.quizApp.restartQuiz();
    });
  };

  /**
   * instantiate the quiz upon the DOM being ready
   */

  $(document).ready(() => {
    const quizApp = new QuizApp(data);
  });

})(jQuery);
