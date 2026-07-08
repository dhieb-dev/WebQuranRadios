import {reciterTab,moshafTab,surahTab,quranNav,radiosNav,radiosTab,locale} from "./elements.js"
import { translations } from "../translations.js"

const rtlLang = ["ar", "ur", "fa", "ug"]
let lang = localStorage.getItem("lang") || "ar"
function translation(el, key) { el.innerHTML = translations[lang][key] }
translation(reciterTab, "reciter")
translation(moshafTab, "moshaf")
translation(surahTab, "surah")
translation(radiosTab, "radios")
translation(quranNav, "quran")
translation(radiosNav, "radios")
locale.innerHTML = localStorage.getItem("native") || "العربية"
document.documentElement.dir = rtlLang.includes(lang) ? "rtl" : "ltr"
document.documentElement.lang = lang
export default lang