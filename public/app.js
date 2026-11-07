const form = document.querySelector("#chatForm");
const input = document.querySelector("#prompt");
const messagesEl = document.querySelector("#messages");
const welcome = document.querySelector("#welcome");
const send = document.querySelector("#send");
let history = [];

function addMessage(role, content) {
  welcome.style.display = "none";
  const row = document.createElement("div");
  row.className = `message ${role}`;
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "assistant" ? "✦" : "Ty";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = content;
  row.append(avatar, bubble);
  messagesEl.append(row);
  document.querySelector("#conversation").scrollTop = document.querySelector("#conversation").scrollHeight;
  return bubble;
}

async function sendMessage(text) {
  const content = text.trim();
  if (!content || send.disabled) return;
  addMessage("user", content);
  history.push({ role: "user", content });
  input.value = "";
  input.style.height = "auto";
  send.disabled = true;
  const typing = addMessage("assistant", "NOVA pisze…");
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Nie udało się połączyć z AI.");
    typing.textContent = data.reply;
    history.push({ role: "assistant", content: data.reply });
  } catch (err) {
    typing.textContent = "Ups! " + err.message;
  } finally {
    send.disabled = false;
    input.focus();
    document.querySelector("#conversation").scrollTop = document.querySelector("#conversation").scrollHeight;
  }
}

form.addEventListener("submit", e => { e.preventDefault(); sendMessage(input.value); });
input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
});
input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 150) + "px"; });
document.querySelectorAll("[data-prompt]").forEach(button => button.addEventListener("click", () => sendMessage(button.dataset.prompt)));
function resetChat() { history = []; messagesEl.innerHTML = ""; welcome.style.display = ""; input.focus(); }
document.querySelector("#newChat").addEventListener("click", resetChat);
document.querySelector("#mobileNew").addEventListener("click", resetChat);