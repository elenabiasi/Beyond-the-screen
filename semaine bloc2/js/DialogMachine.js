import TalkMachine from "https://ecal-mid.ch/talktome/source/1.3/TalkMachine.js";

export default class DialogMachine extends TalkMachine {
  constructor() {
    super();

    this.machineStarted = true;
    this.isSpeaking = false;
    this.lastState = "";
    this.nextState = "";
    this.waitingForUserInput = true;
    this.machineStarted = false;
    this.listQuestions = [];
    this.listAnswer = [];
    this.yellowButtonCpt = 0;
    this.redButtonCpt = 0;
    this.greenButtonCpt = 0;
    this.init();
  }

  init() {
    // EVENT HANDLERS
    this.restartButton.addEventListener(
      "click",
      this.handleRestartButton.bind(this)
    );
    document.addEventListener(
      "TextToSpeechEnded",
      this.handleTextToSpeechEnded.bind(this)
    );
    document.addEventListener("audioEnded", this.handleAudioEnded.bind(this));
    // SOUNDS
    this.sound_error = new Audio("audio/error_buzzer.wav");

    this.listQuestions.push(
      "Which one is ...taking the most care of it’s familly?",
      "Which one is ... most likely to gaslight someone?",
      "Which one ...make weird jokes?",
      "Which one ...is the most unsafe?",
      "Which one ...do you call when you are sad?",
      "Which one ...would hurt you?",
      "Which one ...feels sick?",
      "Which one ...makes you dizzy?",
      "Which one ...smells like gasoline?",
      "Which one ...will betray you?",
      "Which one ...talks the loudest?"
    );

    this.listAnswer.push(
      "...You are the type to ......choose Coke over Pepsi",
      "...You are the type to ......buy a Macbook pro instead of a PC"
    );
  }

  /* ----- EVENT HANDLERS ------- */

  handleRestartButton() {
    console.clear();
    this.start(); // restart the dialog
  }

  handleTesterButtons(button) {
    switch (button) {
      case 1:
        this.ledsAllOff();
        break;
      case 2:
        this.ledsAllChangeColor("red");
        break;
      case 3:
        this.ledsAllChangeColor("yellow", 1);
        break;
      case 4:
        this.ledsAllChangeColor("pink", 2);
        break;

      default:
        this.fancyLogger.logWarning("no action defined for button " + button);
    }
  }

  handleButtonPressed(button) {
    // called when a button is pressed (arduino or simulator)
  }

  handleButtonReleased(button) {
    // called when a button is released (arduino or simulator)
    if (this.waitingForUserInput == true) {
      this.dialogFlow("released", button);
    }
  }

  handleTextToSpeechEnded() {
    // called when the spoken text is finished
    this.isSpeaking = false;
  }

  handleAudioEnded() {
    // called when the playing audio is finished
    console.log("audio ended");
  }

  countButton(button) {
    if (button == 1) {
      this.yellowButtonCpt++;
    } else if (button == 2) {
      this.redButtonCpt++;
    } else if (button == 3) {
      this.greenButtonCpt++;
    }
  }

  handleUserInputError() {
    this.fancyLogger.logWarning("user input is not allowed at this time");
    this.audioMachine.playSound(this.sound_error);
  }

  // Voice presets
  preset_voice_1 = [49, 1, 0.8]; //preset for a voice, voice index, pitch, rate

  //initialise dialogue flow (fonctionne quand on start la machine)
  start() {
    console.clear();
    this.waitingForUserInput = true;
    this.machineStarted = true;
    this.nextState = "initialisation";
    this.buttonPressCounter = 0;

    this.fancyLogger.logMessage("Machine started");
    this.dialogFlow(); // start the machine with first state
  }

  goToNextState() {
    this.dialogFlow();
  }

  dialogFlow(eventType = "default", button = -1) {
    /**** first test before continuing to rules ****/
    if (this.waitingForUserInput === false) {
      this.handleUserInputError();
      return;
    }

    if (this.machineStarted === false) {
      this.fancyLogger.logWarning(
        "Machine is not started yet, press Start Machine"
      );
      return;
    }

    if (this.nextState !== this.lastState) {
      this.fancyLogger.logState(`entering State: ${this.nextState}`);
    } else {
      this.fancyLogger.logState(`staying in State: ${this.nextState}`);
    }

    if (this.speakMachine.isSpeaking === true) {
      // this.fancyLogger.logWarning(
      //   'Im speaking, please wait until I am finished'
      // );
      return;
    }
    this.lastState = this.nextState;

    //machine d'etat: "initialisation", "welcome", "choose"

    /**** States and Rules ****/
    switch (this.nextState) {
      case "initialisation":
        this.fancyLogger.logMessage("Machine is initialised and ready");
        this.fancyLogger.logMessage("Press any button to continue");
        this.ledsAllOff();
        this.nextState = "welcome";
        this.goToNextState();
        break;

      case "welcome":
        this.speakMachine.speakText(
          "Welcome, today i will find out who you really are. To do so, i will ask you questions and you will have to choose between 9 shapes that lights up on the board by pressing one of the 3 buttons. Are you okay with that ? If yes, press any buttons.",
          this.preset_voice_1
        );
        this.nextState = "1";
        break;

      case "1":
        this.countButton(button);
        this.speakMachine.speakText(this.listQuestions[0], this.preset_voice_1);
        // Groupe Round:
        this.ledChangeColor(0, "green", 0),
          // Groupe Spiky:
          this.ledChangeColor(3, "red", 1),
          //Groupe Weird:
          this.ledChangeColor(6, "blue", 2),
          (this.nextState = "2");
        break;

      case "2":
        this.countButton(button);
        this.speakMachine.speakText(this.listQuestions[1], this.preset_voice_1);
        // Groupe Round:
        this.ledChangeColor(0, "green", 0),
          // Groupe Spiky:
          this.ledChangeColor(3, "red", 1),
          //Groupe Weird:
          this.ledChangeColor(6, "blue", 2),
          (this.nextState = "3");
        break;

      case "3":
        this.countButton(button);
        this.speakMachine.speakText(this.listQuestions[2], this.preset_voice_1);
        // Groupe Round:
        this.ledChangeColor(0, "green", 0),
          // Groupe Spiky:
          this.ledChangeColor(3, "red", 1),
          //Groupe Weird:
          this.ledChangeColor(6, "blue", 2),
          (this.nextState = "4");
        break;

      case "4":
        this.countButton(button);
        this.speakMachine.speakText(this.listQuestions[3], this.preset_voice_1);
        // Groupe Round:
        this.ledChangeColor(0, "green", 0),
          // Groupe Spiky:
          this.ledChangeColor(3, "red", 1),
          //Groupe Weird:
          this.ledChangeColor(6, "blue", 2),
          (this.nextState = "5");
        break;

      case "5":
        this.countButton(button);
        this.speakMachine.speakText(this.listQuestions[4], this.preset_voice_1);
        // Groupe Round:
        this.ledChangeColor(0, "green", 0),
          // Groupe Spiky:
          this.ledChangeColor(3, "red", 1),
          //Groupe Weird:
          this.ledChangeColor(6, "blue", 2),
          (this.nextState = "6");
        break;

      case "6":
        this.countButton(button);
        this.speakMachine.speakText(this.listQuestions[5], this.preset_voice_1);
        // Groupe Round:
        this.ledChangeColor(0, "green", 0),
          // Groupe Spiky:
          this.ledChangeColor(3, "red", 1),
          //Groupe Weird:
          this.ledChangeColor(6, "blue", 2),
          (this.nextState = "7");
        break;

      case "7":
        this.countButton(button);
        this.speakMachine.speakText(this.listQuestions[6], this.preset_voice_1);
        // Groupe Round:
        this.ledChangeColor(0, "green", 0),
          // Groupe Spiky:
          this.ledChangeColor(3, "red", 1),
          //Groupe Weird:
          this.ledChangeColor(6, "blue", 2),
          (this.nextState = "8");
        break;

      case "8":
        this.countButton(button);
        this.speakMachine.speakText(this.listQuestions[7], this.preset_voice_1);
        // Groupe Round:
        this.ledChangeColor(0, "green", 0),
          // Groupe Spiky:
          this.ledChangeColor(3, "red", 1),
          //Groupe Weird:
          this.ledChangeColor(6, "blue", 2),
          (this.nextState = "9");
        break;

      case "9":
        this.countButton(button);
        this.speakMachine.speakText(this.listQuestions[8], this.preset_voice_1);
        // Groupe Round:
        this.ledChangeColor(0, "green", 0),
          // Groupe Spiky:
          this.ledChangeColor(3, "red", 1),
          //Groupe Weird:
          this.ledChangeColor(6, "blue", 2),
          (this.nextState = "10");
        break;

      case "10":
        this.countButton(button);
        this.speakMachine.speakText(this.listQuestions[9], this.preset_voice_1);
        // Groupe Round:
        this.ledChangeColor(0, "green", 0),
          // Groupe Spiky:
          this.ledChangeColor(3, "red", 1),
          //Groupe Weird:
          this.ledChangeColor(6, "blue", 2),
          (this.nextState = "11");
        break;

      case "11":
        this.countButton(button);
        this.speakMachine.speakText(
          this.listQuestions[10],
          this.preset_voice_1
        );
        // Groupe Round:
        this.ledChangeColor(0, "green", 0),
          // Groupe Spiky:
          this.ledChangeColor(3, "red", 1),
          //Groupe Weird:
          this.ledChangeColor(6, "blue", 2),
          (this.nextState = "12");
        break;

      case "12":
        
        // Yellow win
        if (this.yellowButtonCpt > this.redButtonCpt && this.yellowButtonCpt > this.greenButtonCpt) {
          if (this.redButtonCpt > this.greenButtonCpt){

          }
          else if (this.redButtonCpt < this.greenButtonCpt){

          }
        } 

        // Red win
        else if (this.redButtonCpt > this.yellowButtonCpt && this.redButtonCpt > this.greenButtonCpt) {
          if (this.yellowButtonCpt > this.greenButtonCpt){

          }
          else if (this.yellowButtonCpt < this.greenButtonCpt){

          }
        } 

        // Green win
        else if (this.greenButtonCpt > this.yellowButtonCpt && this.greenButtonCpt > this.redButtonCpt) {
          if (this.yellowButtonCpt > this.redButtonCpt){

          }
          else if (this.yellowButtonCpt < this.redButtonCpt){

          }
        }

        this.speakMachine.speakText(
          "Thank you for answering my questions. I will proceed to tell you what kind of person you are. ...You are the type to ......choose Coke over Pepsi",
          this.preset_voice_1
        );
        // Groupe Round:
        this.ledChangeColor(0, "green", 0),
          // Groupe Spiky:
          this.ledChangeColor(3, "red", 1),
          //Groupe Weird:
          this.ledChangeColor(6, "blue", 2),
          (this.nextState = "welcome");
        break;

      // case 'choose-color':
      //   if (button == 0) {
      //     // blue
      //     this.nextState = 'choose-blue';
      //     this.goToNextState();
      //   }
      //   if (button == 1) {
      //     // yellow
      //     this.nextState = 'choose-yellow';
      //     this.goToNextState();
      //   }
      //   break;

      // case 'choose-blue':
      //   this.fancyLogger.logMessage('Blue was a good choice');
      //   this.fancyLogger.logMessage('Press any button to continue');
      //   this.nextState = 'can-speak';
      //   break;

      // case 'choose-yellow':
      //   this.fancyLogger.logMessage('Yellow was a bad choice');
      //   this.fancyLogger.logMessage('Press blue to continue');
      //   this.nextState = 'choose-color';
      //   this.goToNextState();
      //   break;

      // case 'can-speak':
      //   this.speakMachine.speakText(
      //     'Which one is taking the most care of it’s familly?',
      //     this.preset_voice_1
      //   );
      //   this.nextState = 'count-press';
      //   break;

      // case 'count-press':
      //   this.buttonPressCounter++;
      //   this.speakMachine.speakText(
      //     'you pressed ' + this.buttonPressCounter + ' time',
      //     this.preset_voice_1
      //   );

      //   if (this.buttonPressCounter > 2) {
      //     this.nextState = 'toomuch';
      //     this.goToNextState();
      //   }
      //   break;

      // case 'toomuch':
      //   this.speakMachine.speakText(
      //     'You are pressing too much! I Feel very pressed',
      //     this.preset_voice_1
      //   );
      //   this.nextState = 'enough-pressed';
      //   break;

      // case 'enough-pressed':
      //   this.speakMachine.speakText(
      //     'Enough is enough! I dont want to be pressed anymore!',
      //     this.preset_voice_1
      //   );
      //   break;

      default:
        this.fancyLogger.logWarning(
          `Sorry but State: "${this.nextState}" has no case defined`
        );
    }
  }
}

window.onload = () => {
  const dialogMachine = new DialogMachine();
};
