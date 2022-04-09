// ==UserScript==
// @name        Better LETUS Dashboard 2022
// @namespace   https://github.com/yawarakacream/better-letus-dashboard
// @match       https://letus.ed.tus.ac.jp/my/
// @grant       none
// @version     20220409
// @author      ywrs
// @description LETUS のダッシュボードを改良する
// ==/UserScript==

(() => {
  
  // 設定 ===========================================================
  
  /*
   * 時間割関連
   */
  const enableTimetable = true;
  // 表示する時間の範囲．0-indexed (1 限 => 0, 2 限 => 1, ...)
  const periodRange = { first: 0, last: 4 };
  // 表示する曜日
  const daysDisplay = {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
  };
  // デフォルトで表示する学期．first: 前期, second: 後期
  const defaultSemester = "first";
  // 時間割に載せるコース ID 一覧．ID は LETUS の https://letus.ed.tus.ac.jp/course/view.php?id= の後の部分．月 1 〜土 7 まで
  const timetableCourses = {
    // 前期
    first: {
      monday: [null, null, null, null, null, null, null],
      tuesday: [null, null, null, null, null, null, null],
      wednesday: [null, null, null, null, null, null, null],
      thursday: [null, null, null, null, null, null, null],
      friday: [null, null, null, null, null, null, null],
      saturday: [null, null, null, null, null, null, null],
    },
    // 後期
    second: {
      monday: [null, null, null, null, null, null, null],
      tuesday: [null, null, null, null, null, null, null],
      wednesday: [null, null, null, null, null, null, null],
      thursday: [null, null, null, null, null, null, null],
      friday: [null, null, null, null, null, null, null],
      saturday: [null, null, null, null, null, null, null],
    },
  };
  // 時間割の下部に置くコース ID 一覧 (ショートカット)．集中講義や学科情報など．不要な場合は空に．
  const shortcutCourses = [127161, 11197];
  // コース名をシンプルにする
  // 具体的には「離散数学（有限数学２） (9914715)」→「離散数学」のように
  // 半角全角を問わず最初の括弧でコース名を打ち切り，前後のスペースも消す
  const simpleCourseName = true;
  
  /*
   * 「タイムラインブロック」関連
   * 
   * LETUS の初期値 (= 最小値) の場合，余計なロードは省略される
   */
  const enableTimelineBlockModifier = true;
  // 表示件数．5, 10, 25 のいずれか
  const displayedSubmissions = 25;
  // 提出期限．7, 30, 90, 180 のいずれか [日] または "all" または "overdue"
  const submissionLimit = "all";
  
  // 処理 ===========================================================
  
  /**
   * 定数
   */
  const bldVersion = "20220409";
  const targetLetusVersion = "2022";
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  
  const periods = [
    { begin: [8, 50], end: [10, 20] },
    { begin: [10, 30], end: [12, 00] },
    { begin: [12, 50], end: [14, 20] },
    { begin: [14, 30], end: [16, 00] },
    { begin: [16, 10], end: [17, 40] },
    { begin: [18, 00], end: [19, 30] },
    { begin: [19, 40], end: [21, 10] },
  ];
  
  /**
   * Utility
   */
  const mapObject = (object, map) => Object.fromEntries(Object.entries(object).map(([k, v]) => [k, map(k, v)]));
  
  // info, error
  const log = mapObject({info: "log", error: "error"}, (_, level) => {
    return (type, ...args) => console[[level]](`[BLD-${type}]`, ...args);
  });
  
  const wait = (fn) => new Promise((resolve, reject) => {
    const t = setInterval(() => {
      try {
        if (fn()) {
          clearInterval(t);
          resolve();
        }
      }
      catch (e) {
        clearInterval(t);
        reject();
      }
    }, 10);
  });
  
  const calcMinutes = (h, m) => h * 60 + m;
  
  const to2DigitString = (n) => n < 10 ? `0${n}` : `${n}`;
  const toStringTime = (hours, minutes) => to2DigitString(hours) + ":" + to2DigitString(minutes);
  
  /**
   * 時間割を追加する
   */
  const addTimetable = () => {
    const courseUrlPrefix = "https://letus.ed.tus.ac.jp/course/view.php?id=";
    const courseIdToName = (() => {
      let array = Array.from($("#block-region-side-pre ul a"))
        .filter(el => el.href.startsWith(courseUrlPrefix))
        .map(el => [+el.href.slice(courseUrlPrefix.length), el.textContent]);
      if (simpleCourseName) {
        array = array.map(([id, name]) => [id, name.replaceAll(/(\(|（).*$/g, "").trim()]);
      }
      return new Map(array);
    })();
    console.log(courseIdToName)
    
    const getNowTime = () => {
      const nowDate = new Date();
      const nowMinutes = calcMinutes(nowDate.getHours(), nowDate.getMinutes());
      const day = 1 <= nowDate.getDay() && nowDate.getDay() <= 5 ? days[nowDate.getDay() - 1] : undefined;
      let period = periods.findIndex(p => nowMinutes < calcMinutes(...p.end));
      period = period === -1 ? undefined : period;
      const status = period === undefined ? "finished" : calcMinutes(...periods[period].begin) <= nowMinutes ? "running" : "waiting";
      return { day, period, status };
    };
    const create = (data) => {
      const { time: { day, period, status }, semester } = data;
      return `
        <${"style"}>
          .letusbd-table {
            width: 100%;
            table-layout: fixed;
          }
          .letusbd-table-c-day {
            text-align: center;
            font-weight: bold;
          }
          .letusbd-table-c-day[data-highlight="true"] {
            background-color: white;
          }
          .letusbd-table-c-period {
            margin: 0;
            padding: 0;
            width: min(64px, calc(100vw / (${Object.values(daysDisplay).filter(d => d).length}) - 24px));
          }
          .letusbd-table-switcher {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-around;
          }
          #letusbd-table-switcher-button {
            color: #0f6fc5;
            cursor: pointer;
            user-select: none;
          }
          .letusbd-table-r-period {
            position: relative;
            height: max(10vh, 96px);
            vertical-align: top;
          }
          .letusbd-table-r-period[data-highlight="true"] {
            background-color: white;
          }
          .letusbd-table-r-period-content {
            position: absolute;
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .letusbd-table-r-period-content span, b {
            text-align: center;
          }
          .letusbd-table-subject {
            padding: 4px;
          }
          .letusbd-table-subject[data-highlight="running"] {
            background-color: floralwhite;
          }
          .letusbd-table-subject[data-highlight="waiting"] {
            background-color: white;
          }
        </${"style"}>
        <div class="card-text mt-3">
          <div class="block-overview block-cards">
            <table class="letusbd-table" rules="all">
              <tr>
                <td class="letusbd-table-c-period">
                  <div class="letusbd-table-switcher">
                    <span id="letusbd-table-switcher-button">
                      ${{first: "前期", second: "後期"}[semester]}
                    </span>
                  </div>
                </td>
                ${days.filter((d) => daysDisplay[d]).map((d) => `
                  <td class="letusbd-table-c-day" data-highlight="${day === d}">
                    ${{
                      monday: "月",
                      tuesday: "火",
                      wednesday: "水",
                      thursday: "木",
                      friday: "金",
                      saturday: "土"
                      }[d]}
                  </td>
                `).join("")}
              </tr>
              ${[...new Array(periodRange.last - periodRange.first + 1).keys()]
                .map((i) => i + periodRange.first).map((p) => `
                  <tr>
                    <td class="letusbd-table-r-period" data-highlight="${period === p}">
                      <div class="letusbd-table-r-period-content">
                        <span>${toStringTime(...periods[p].begin)}</span>
                        <b>${p + 1}</b>
                        <span>${toStringTime(...periods[p].end)}</span>
                      </div>
                    </div>
                    </td>
                      ${days.filter((d) => daysDisplay[d]).map((d) => `
                        <td class="letusbd-table-subject" data-highlight="${(period === p && day === d) && status}">
                          ${!timetableCourses[semester][d][p] ? `` : `
                            <a href=${courseUrlPrefix + timetableCourses[semester][d][p]}>
                              ${courseIdToName.get(timetableCourses[semester][d][p])}
                            </a>
                          `}
                        </td>
                      `).join("")}
                  </tr>
                `).join("")}
            </table>
          </div>
          ${shortcutCourses.length === 0 ? "" : `
            <div class="card-text mt-3">
              ${shortcutCourses.map((id) => `
                <a href=${courseUrlPrefix + id}>
                  ${courseIdToName.get(id)}
                </a>
              `).join("<br />")}
            </div>
          `}
        </div>
      `;
    }
    
    const root = $("#block-region-content");
    const container = $(`<section class="block_myoverview block card mb-3">`);
    root.prepend(container);
    
    const data = { semester: defaultSemester, time: getNowTime() };
    const render = () => {
      log.info("Timetable", `rendering...`);
      container.html(`
        <div class="card-body p-3">
          <h5 class="card-title d-inline">時間割</h5>
          ${create(data)}
        </div>
      `);
      document.getElementById("letusbd-table-switcher-button").onclick = () => {
        data.semester = data.semester === "first" ? "second" : "first";
        render();
        log.info("Timetable", `semester switched: ${data.semester}`);
      };
      log.info("Timetable", `rendered: ${new Date().toISOString()}`);
    };
    render();
    const t = setInterval(() => {
      try {
        render();
      }
      catch (e) {
        clearInterval(t);
        log.info("Timetable", "Rendering errored:", e);
      }
    }, 1000 * 60);
  }
  
  /**
   * タイムラインブロックを操作する
   */
  const modifyTimelineBlock = async () => {
    // 安全のため，対応するタイムラインブロックは 1 つだけにする
    const $1 = (args) => {
      const ret = $(args);
      return ret.length === 1 ? $(ret[0]) : undefined;
    };
    if (!$1(`div[data-region="event-list-loading-placeholder"]`)) {
      log("TimelineBlockModifier", "Timeline-Block is not found.");
      return;
    }
    
    // 適当に待機しないとうまくいかない・・・
    const waitForLoading = async (time) => {
      await wait(() => $1(`div[data-region="event-list-loading-placeholder"]`).attr("class") === "hidden");
      if (time) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    // イベントを発火させず直接変更することもできるはずだが、それらしい関数が見当たらなかったので雑実装
    await waitForLoading();
    if (displayedSubmissions != 5) {
      $1(`div[class="block-timeline"] .dropdown-item[data-limit="${displayedSubmissions}"]`).click();
      await waitForLoading(true);
    }
    if (submissionLimit != 7) {
      if (submissionLimit === "all") {
        $1(`div[class="block-timeline"] .dropdown-item[data-from="-14"][data-filtername="all"]`).click();
      }
      else if (submissionLimit === "expired") {
        $1(`div[class="block-timeline"] .dropdown-item[data-from="-14"][data-filtername="overdue"]`).click();
      }
      else {
        $1(`div[class="block-timeline"] .dropdown-item[data-to="${submissionLimit}"]`).click();
      }
      await waitForLoading(true);
    }
  };
  
  /**
   * 全体の安全装置
   */
  const checkSafety = async () => {
    // - 年度が合わなければならない
    // - location.href が https://letus.ed.tus.ac.jp/my/ と完全一致する
    // - LETUS 側のカスタマイズ機能を使用中ではない
    return await Promise.all([
        [
          () => $(`footer > div:contains("(c)2011-${targetLetusVersion} Tokyo University of Science")`).length === 1,
          "Illegal LETUS version!",
        ], [
          () => location.href === "https://letus.ed.tus.ac.jp/my/",
          "Illegal location.href!",
        ], [
          () => $(`button:contains("このページをカスタマイズする")`).length === 1,
          "LETUS is customize mode!",
        ]
      ].map(([f, m]) => new Promise((resolve, reject) => f() ? resolve() : reject(m)))
    ).then(() => true).catch((m) => log.error("Safety", `Stopped: ${m}`));
  }
  
  /**
   * main
   */
  (async () => {
    log.info("Main", `Better LETUS Dashboard v${bldVersion} for LETUS ${targetLetusVersion}`);
    
    // LETUS の jQuery の読み込みを待機
    await wait(() => "$" in window);
    log.info("Main", "jQuery has been loaded.");
    
    // 安全装置
    if (!(await checkSafety())) {
      return;
    }
    
    // 時間割
    if (enableTimetable) {
      try {
        log.info("Timetable", "Loading...");
        addTimetable();
        log.info("Timetable", "Successfully loaded.");
      }
      catch (e) {
        log.error("Timetable", "Errored:", e);
      }
    }
    
    // 「タイムライン」ブロック
    if (enableTimelineBlockModifier) {
      try {
        log.info("TimelineBlockModifier", "Loading...");
        await modifyTimelineBlock();
        log.info("TimelineBlockModifier", "Successfully loaded.");
      }
      catch (e) {
        log.info("TimelineBlockModifier", "Errored:", e);
      }
    }
  })();
  
})();
