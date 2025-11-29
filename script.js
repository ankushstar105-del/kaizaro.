document.addEventListener("DOMContentLoaded", () => {
  // ----- ELEMENTS -----
  const loginScreen = document.getElementById("loginScreen");
  const appUI = document.getElementById("appUI");
  const nameInput = document.getElementById("nameInput");
  const passwordInput = document.getElementById("passwordInput");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const classInput = document.getElementById("classInput");
  const subjectInput = document.getElementById("subjectInput");
  const topicInput = document.getElementById("topicInput");
  const genNotesBtn = document.getElementById("genNotesBtn");
  const chatBox = document.getElementById("chatBox");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const micBtn = document.getElementById("micBtn");
  const fileInput = document.getElementById("fileInput");
  const themeToggle = document.getElementById("themeToggle");

  // ----- LOGIN -----
  function login() {
    if (!nameInput.value || !passwordInput.value) {
      alert("Enter Name & Password!");
      return;
    }
    loginScreen.classList.add("hidden");
    appUI.style.display = "flex";
    localStorage.setItem("userName", nameInput.value);
    addAIMessage(`Welcome ${nameInput.value}! 🎓`);
  }

  loginBtn.addEventListener("click", login);

  // Auto-login if username exists
  if (localStorage.getItem("userName")) {
    loginScreen.classList.add("hidden");
    appUI.style.display = "flex";
    addAIMessage(`Welcome back ${localStorage.getItem("userName")}! 🎓`);
  }

  // ----- LOGOUT -----
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userName");
    location.reload();
  });
  loginBtn.addEventListener("click", () => {
  const name = document.getElementById("nameInput").value.trim();
  const pass = document.getElementById("passwordInput").value.trim();

  if (!name || !pass) {
    alert("Enter Name and Password!");
    return;
  }

  localStorage.setItem("user", name);

  // Hide login + intro content
  loginScreen.remove();  // <--- Full remove better than hide
  const intro = document.getElementById("introSection");
  if (intro) intro.remove();

  // Show App UI
  appUI.classList.remove("hidden");
});


  // ----- CHAT -----
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  function sendMessage() {
    const msg = userInput.value.trim();
    if (!msg) return;
    addUserMessage(msg);
    userInput.value = "";
    addAIMessage("Processing...");
    // Here you can add actual AI response logic or API call
  }

  function addUserMessage(msg) {
    const div = document.createElement("div");
    div.classList.add("user-msg");
    div.textContent = msg;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function addAIMessage(msg) {
    const div = document.createElement("div");
    div.classList.add("ai-msg");
    div.textContent = msg;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // ----- NOTES API -----
  genNotesBtn.addEventListener("click", async () => {
    const topic = topicInput.value.trim();
    if (!topic) {
      addAIMessage("⚠️ Enter Topic first!");
      return;
    }
    addAIMessage("📚 Fetching notes...");

    try {
      const response = await fetch("/api/get_notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: topic }),
      });
      const data = await response.json();
      addAIMessage(data.answer || "No notes found.");
    } catch (err) {
      addAIMessage("❌ Failed to fetch notes.");
      console.error(err);
    }
  });

  // ----- FILE UPLOAD -----
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      addAIMessage(`📎 File Selected: ${fileInput.files[0].name}`);
    }
  });

  // ----- THEME TOGGLE -----
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  // ----- SPEECH TO TEXT -----
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    micBtn.disabled = true;
    micBtn.innerText = "❌";
  } else {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;

    micBtn.addEventListener("click", () => {
      recognition.start();
      micBtn.innerText = "🎙️";
    });

    recognition.addEventListener("result", (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      userInput.value = text;
    });

    recognition.addEventListener("end", () => {
      micBtn.innerText = "🎤";
    });
  }
});

