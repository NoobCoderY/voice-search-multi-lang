const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;


const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const searchInputEl = document.querySelector(".searchInputEl");
const voiceSearchEl = document.querySelector(".voiceSearch");
const langSelectionDropdownEl = document.querySelector(".langSelectionDropdown");
const translatedOutputEl = document.querySelector(".translatedOutput");

let preferredLangSelected = "";

voiceSearchEl.addEventListener('click', (_e) => {
  if (!preferredLangSelected) {
    langSelectionDropdownEl.style.display = 'block';
  } else {
    voiceSearchEl.setAttribute("src", "./assets/mic-active.png");
    recognition.start();
  }
});

langSelectionDropdownEl.addEventListener('change', (e) => {
  preferredLangSelected = e.target.value;
  recognition.lang = preferredLangSelected;
  voiceSearchEl.setAttribute("src", "./assets/mic-active.png");
  recognition.start();
});

recognition.onresult = (event) => {
  const textValue = event.results[0][0].transcript;
  searchInputEl.value = textValue;
  if (preferredLangSelected != 'en') {
    translateToEnglish(searchInputEl.value);
  }
}

recognition.onspeechend = () => {
  voiceSearchEl.setAttribute("src", "./assets/mic.png");
}

const translateToEnglish = async (userVoiceInput) => {  
  console.log({userVoiceInput, preferredLangSelected});
  const encodedParams = new URLSearchParams();
  encodedParams.set('q', userVoiceInput);
  encodedParams.set('target', 'en');
  encodedParams.set('source', preferredLangSelected);

  const url = 'https://google-translate1.p.rapidapi.com/language/translate/v2';
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'application/gzip',
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
    },
    body: encodedParams
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    translatedOutputEl.textContent = result.data.translations[0].translatedText;
  } catch (error) {
    console.error(error);
  }
};
