import {
  btnBackToTop,
  progressDoc,
  header
} from "./elements.js"

window.addEventListener("scroll", () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  progressDoc.style.width = `${scrolled}%`
  if (window.scrollY > 400) {
    header.classList.add("fixed", "-top-100", "duration-500")
    if (window.scrollY > 500) {
      btnBackToTop.classList.add("translate-x-0")
      header.classList.add("top-0")
    } else {
      btnBackToTop.classList.remove("translate-x-0")
      header.classList.remove("top-0")
    }
  } else {
    header.classList.remove("fixed", "-top-100", "duration-500")
  }
})

// // Event Btn back to top
btnBackToTop.addEventListener("click", () => {
  scrollTo( {
    top: 0, behavior: "smooth"
  })
})