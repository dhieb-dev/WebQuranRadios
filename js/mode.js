// Theme mode
let isDarkMode = false
document.getElementById("btn-mode").addEventListener("click", () => {
  if (isDarkMode) {
    document.documentElement.classList.remove("dark")
    document.getElementById("btn-mode").innerHTML = "🌙"
    isDarkMode = false
  } else {
    document.documentElement.classList.add("dark")
    document.getElementById("btn-mode").innerHTML = "☀️"
    isDarkMode = true
  }
})