// DOM elements
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const typingIndicator = document.getElementById("typing");
const downloadBtn = document.getElementById("download-btn");

// User profile form
const profileForm = document.getElementById("user-profile-form");
const skipBtn = document.getElementById("skip-profile");

// Navigation
function navigateTo(sectionId) {
  document.querySelectorAll("section").forEach((section) => {
    section.classList.remove("visible-section");
    section.classList.add("hidden-section");
  });
  document.getElementById(sectionId).classList.add("visible-section");
  document.getElementById(sectionId).classList.remove("hidden-section");
}

// Profile form submission
profileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  storeProfile();
  navigateTo("chat-section");
});

skipBtn.addEventListener("click", () => {
  navigateTo("chat-section");
});

// Store and display profile info
function storeProfile() {
  const name = document.getElementById("name").value || "Anonymous";
  const dob = document.getElementById("dob").value || "Not provided";
  const height = document.getElementById("height").value || "Not provided";
  const weight = document.getElementById("weight").value || "Not provided";

  document.getElementById("stat-name").textContent = name;
  document.getElementById("stat-dob").textContent = dob;
  document.getElementById("stat-height").textContent = height;
  document.getElementById("stat-weight").textContent = weight;
}

// Typing animation
function showTyping(show = true) {
  typingIndicator.style.display = show ? "block" : "none";
}

// Message bubble
function addMessage(content, isUser = false) {
  const msg = document.createElement("div");
  msg.className = isUser ? "chat-message user" : "chat-message bot";
  msg.innerHTML = isUser ? `🙋‍♀️ You: ${content}` : `👩‍⚕️ Dr. Bumpy: ${content}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Handle chat form submit
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, true);
  userInput.value = "";
  showTyping(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    showTyping(false);
    addMessage(data.reply, false);
  } catch (err) {
    showTyping(false);
    addMessage("⚠️ Error reaching AI. Please try again later.", false);
  }
});

// Download PDF
downloadBtn.addEventListener("click", () => {
  const stats = document.getElementById("stats-content");
  const opt = {
    margin: 0.5,
    filename: "DrBumpy_Health_Report.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };
  html2pdf().set(opt).from(stats).save();
});
