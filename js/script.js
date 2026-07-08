import './scroll.js';
import './mode.js';
import getApiData from './apis.js';
import * as el from "./elements.js"
import lang from "./languages.js"
import {
  translations
} from "../translations.js"

// main
async function fetchAllQuranData() {
  const {
    langsData,
    recitersData,
    suwarData,
    radiosData
  } = await getApiData(lang)
  setTimeout(() => el.downloadPage.classList.add("hidden"), 200)
  el.list.innerHTML = langsData.language.map((lang) => `<div data-locale="${lang.locale}" data-native="${lang.native}" class="inline-block mx-1 my-1 py-2 px-1 rounded-lg shadow bg-gray-100 dark:bg-slate-900">${lang.native}</div>`).join("")
  el.btnLangs.addEventListener("click", () => el.listLangs.classList.toggle('hidden'))
  el.close.addEventListener("click", () => el.listLangs.classList.add('hidden'))
  Array.from(el.list.children).forEach(child => {
    child.addEventListener("click", (e) => {
      localStorage.setItem("lang", e.target.dataset.locale)
      localStorage.setItem("native", e.target.dataset.native)
      navigation.reload()
    })
  })
  //Event Click Navs
  el.quranNav.addEventListener("click",
    () => {
      el.containerQuran.classList.remove("hidden");
      el.containerRadios.classList.add("hidden");
      el.quranRow.appendChild(el.searchSec)
    });
  el.radiosNav.addEventListener("click",
    () => {
      el.containerQuran.classList.add("hidden");
      el.containerRadios.classList.remove("hidden");
      el.radioRow.appendChild(el.searchSec)
      radiosHtml();
    });

  // Display Data The Section
  let reciters = ""

  function recitersHtml() {
    reciters = recitersData
    el.recitersSec.innerHTML = recitersData.reciters
    .map(
      (reciter, index) => `
      <div data-index="${index}" class="p-3 rounded-lg bg-white dark:bg-slate-900 cursor-pointer w-full min-w-0">
      <div class="font-bold pointer-events-none truncate">${reciter.name}</div>
      <div class="mt-1 text-xs text-blue-500 pointer-events-none truncate"> ${translations[lang].moshaf_count || "عدد المصاحف"} : ${reciter.moshaf.length}</div>
      </div>
      `
    )
    .join("");
    searchHTML(recitersData)
  }

  recitersHtml();
  let moshafs = ""

  function moshafsHtml(index) {
    el.moshafsSec.innerHTML = recitersData.reciters[index].moshaf
    .map(
      (moshaf) => `
      <div data-server="${moshaf.server}" data-list="${moshaf.surah_list}" class="p-3 rounded-lg bg-white dark:bg-slate-900 cursor-pointer">
      <div class="font-bold pointer-events-none">${moshaf.name}</div>
      <div class="text-sm text-gray-700 pointer-events-none">${moshaf.name}</div>
      </div>
      `
    )
    .join("");
    moshafs = recitersData.reciters[index].moshaf
    searchHTML(recitersData,
      index)
  }

  let audiosList = "";
  let filterSuwar = "";

  function suwarHtml(server,
    list) {
    filterSuwar = suwarData.suwar.filter((surah) =>
      list.split(",").includes(String(surah.id))
    ).map((surah) => ({
        id: surah.id,
        name: surah.name,
        url: `${server}${String(surah.id).padStart(3, "0")}.mp3`,
      }));

    el.suwarSec.innerHTML = filterSuwar.map(
      (surah, index) => `
      <div data-index="${index}" data-id="${surah.id}" class="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-slate-900   cursor-pointer">
      <div>
      <div class="font-bold pointer-events-none">${surah.name}</div>
      <div class="text-sm text-gray-700 dark:text-gray-200 pointer-events-none">${surah.name}</div>
      </div>
      <a class="grid place-items-center w-8 h-8 bg-sky-100 dark:bg-zinc-200 rounded-full" href="${surah.url}" download>🎧</a>
      </div>
      `).join("");
    searchHTML(filterSuwar)
  }
  let radios = ""

  function radiosHtml() {
    radios = radiosData.radios
    el.radiosSec.innerHTML = radiosData.radios.map(
      (radio, index) => `
      <div data-id="${radio.id}" data-index="${index}" class="p-3 rounded-lg bg-white dark:bg-slate-900   cursor-pointer">
      <div class="font-bold pointer-events-none">${radio.name}</div>
      <div class="text-sm text-gray-700 pointer-events-none">${radio.name}</div>
      </div>
      `
    )
    .join("");
    searchHTML(radiosData)
  }

  // Search
  let isOpen = false
  el.btnSearch.addEventListener("click", () => {
    if (isOpen) {
      el.inputSearch.classList.remove("w-40")
      el.btnSearch.innerHTML = '<svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      isOpen = false
    } else {
      el.inputSearch.classList.add("w-40")
      el.inputSearch.focus()
      el.btnSearch.innerHTML = '<svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/><path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/></svg>'
      isOpen = true
    }
  })

  function searchHTML(arg,
    index = null) {
    const arr = (index === null && arg.reciters) ? arg.reciters:
    (index !== null && arg.reciters?.[index]?.moshaf) ? arg.reciters[index].moshaf:
    (index === null && arg.radios) ? arg.radios:
    (Array.isArray(arg) ? arg: []);
    el.listSearch.innerHTML = arr.map((item, i) => {
      const attrs = item.moshaf ? `data-type="reciter" data-index="${i}"`:
      item.server ? `data-type="moshaf" data-server="${item.server}" data-list="${item.surah_list}"`:
      item.recent_date ? `data-type="radio" data-id="${item.id}" data-list="${item.surah_list}"`:
      `data-type="surah" data-id="${item.id}" data-index="${i}"`;
      return `<option ${attrs} value="${item.name}"></option>`;
    }).join("");
  }

  function handleSearchSelection() {
    el.inputSearch.addEventListener("input",
      (e) => {
        const opt = el.listSearch.querySelector(`option[value="${e.target.value}"]`);
        if (!opt) return;

        const type = opt.dataset.type;
        const actions = {
          reciter: () => {
            el.recitersSec.classList.add("hidden");
            ["moshafsSec",
              "moshafTab"
            ].forEach(k => el[k].classList.remove("hidden"));
            moshafsHtml(opt.dataset.index);
          },
          moshaf: () => {
            el.moshafsSec.classList.add("hidden");
            ["surahTab",
              "suwarSec"
            ].forEach(k => el[k].classList.remove("hidden"));
            suwarHtml(opt.dataset.server, opt.dataset.list);
          },
          surah: () => {
            audiosList = filterSuwar;
            updateAudio(opt.dataset.id);
            el.player.classList.remove("hidden");
          },
          radio: () => {
            audiosList = radios;
            updateAudio(opt.dataset.id);
            el.player.classList.remove("hidden");
          }
        };

        if (actions[type]) {
          actions[type]();
          e.target.value = "";
        }
      });
  }
  handleSearchSelection();

  // Event Click Items Sections
  el.recitersSec.addEventListener("click",
    (e) => {
      el.recitersSec.classList.add("hidden");
      ["moshafsSec",
        "moshafTab"
      ].forEach(k => el[k].classList.remove("hidden"));
      moshafsHtml(e.target.dataset.index);
    });

  el.moshafsSec.addEventListener("click",
    (e) => {
      el.moshafsSec.classList.add("hidden");
      el.surahTab.classList.remove("hidden");
      el.suwarSec.classList.remove("hidden");
      suwarHtml(e.target.dataset.server, e.target.dataset.list);
    });

  el.suwarSec.addEventListener("click",
    (e) => {
      audiosList = filterSuwar
      updateAudio(e.target.dataset.id);
      el.player.classList.remove("hidden");
    });

  el.radiosSec.addEventListener("click",
    (e) => {
      audiosList = radiosData.radios;
      updateAudio(e.target.dataset.id);
      el.player.classList.remove("hidden");
    });

  // Event Click Tabs
  el.reciterTab.addEventListener("click",
    () => {
      el.suwarSec.classList.add("hidden");
      el.surahTab.classList.add("hidden");
      el.moshafsSec.classList.add("hidden");
      el.moshafTab.classList.add("hidden");
      el.recitersSec.classList.remove("hidden");
      searchHTML(reciters)
    });

  el.moshafTab.addEventListener("click",
    () => {
      el.suwarSec.classList.add("hidden");
      el.surahTab.classList.add("hidden");
      el.moshafsSec.classList.remove("hidden");
      searchHTML(moshafs)
    });

  // Event Click The Next & Prev
  el.nextBtn.addEventListener("click",
    () => {
      if (currentIndex < audiosList.length - 1) {
        updateAudio(null, currentIndex + 1);
      } else {
        updateAudio(null, 0);
      }
    });

  el.prevBtn.addEventListener("click",
    () => {
      if (currentIndex > 0) {
        updateAudio(null, currentIndex - 1);
      } else {
        updateAudio(null, audiosList.length - 1);
      }
    });

  function g() {
    function toggleAudio() {
      el.audio.paused ? el.audio.play(): el.audio.pause();
    }

    [el.playBtn, el.pauseBtn].forEach((btn) =>
      btn.addEventListener("click", toggleAudio)
    );

    el.audio.addEventListener("play",
      () => {
        el.playBtn.classList.add("hidden");
        el.pauseBtn.classList.remove("hidden");
      });

    el.audio.addEventListener("pause",
      () => {
        el.pauseBtn.classList.add("hidden");
        el.playBtn.classList.remove("hidden");
      });

    el.audio.addEventListener("ended",
      () => {
        el.pauseBtn.classList.add("hidden");
        el.playBtn.classList.remove("hidden");
      });

    el.audio.addEventListener("timeupdate",
      () => {
        el.progessRing.style.width = `${
        (el.audio.currentTime / el.audio.duration) * 100
        }%`;
        el.currentTime.innerHTML = formatTime(el.audio.currentTime);
      });

    el.audio.addEventListener("loadedmetadata",
      () => {
        el.durationTime.innerHTML = isFinite(el.audio.duration) ?
        formatTime(el.audio.duration): "LIVE";
      });

    el.progessBar.addEventListener("click",
      (e) => {
        const width = el.progessBar.clientWidth;
        const clickX = e.offsetX;
        const duration = el.audio.duration;
        el.audio.currentTime = (clickX / width) * duration;
      });

    function formatTime(seconds) {
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min}:${sec < 10 ? "0" + sec: sec}`;
    }
  }
  g();

  let currentIndex = 0;

  function updateAudio(id = null,
    index = null) {
    let audioObj = null;

    if (id !== null) {
      audioObj = audiosList.find((item) => item.id == id);
      currentIndex = audiosList.indexOf(audioObj);
    } else if (index !== null) {
      if (index >= 0 && index < audiosList.length) {
        currentIndex = index;
        audioObj = audiosList[currentIndex];
      }
    }

    if (audioObj) {
      el.nameAudio.innerHTML = audioObj.name;
      el.audio.src = audioObj.url;
      el.audio.play();
    }
  }
}
fetchAllQuranData();