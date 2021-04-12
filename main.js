// ==UserScript==
// @name        Better LETUS Dashboard
// @namespace   Violentmonkey Scripts
// @match       https://letus.ed.tus.ac.jp/my/
// @grant       none
// @version     202104-1.1
// @author      ywrs
// @description LETUS のダッシュボードを改良する
// ==/UserScript==

(() => {
  
  // 設定 ===========================================================
  
  /*
   * 時間割関連
   */
  const enableTimetable = true;
  // 表示する時間の範囲．0-indexed
  const periodRange = { first: 0, last: 4 };
  // 表示する曜日
  const daysDisplay = {
    "monday": true,
    "tuesday": true,
    "wednesday": true,
    "thursday": true,
    "friday": true,
    "saturday": false,
  };
  // コース ID 一覧．ID は LETUS の https://letus.ed.tus.ac.jp/course/view.php?id= の後の部分．月 1 〜土 7 まで
  const courses = {
    "monday": [142575, 142575, 143058, 143157, 142563, null, null],
    "tuesday": [129254, null, 142839, 128821, 141647, null, null],
    "wednesday": [129321, 143062, 129376, null, null, null, null],
    "thursday": [129376, 143157, null, null, null, null, null],
    "friday": [142659, null, null, null, null, null, null],
    "saturday": [null, null, null, null, null, null, null],
  };
  
  /*
   * 「タイムラインブロック」関連
   * 
   * displayedSubmissions, submissionLimit は両方弄るとロードが 2 回入るので、どちらか一方だけ変更がいいかもしれない
   * LETUS の初期値 (<=> ともに最小値) の場合，余計なロードは省略される
   */
  const enableTimelineBlockModifier = true;
  // 表示件数．5, 10, 25 のいずれか
  const displayedSubmissions = 25;
  // 提出期限．7, 30, 90, 180 のいずれか [日]
  const submissionLimit = 30;
  
  // 処理 ===========================================================
  
  /**
   * Utility
   */
  const wait = fn => new Promise(resolve => {
    const t = setInterval(() => {
      if (fn()) {
        clearInterval(t);
        resolve();
      }
    }, 10);
  });
  
  const to2DigitString = n => n < 10 ? "0" + `${n}` : `${n}`;
  const toStringTime = (hours, minutes) => to2DigitString(hours) + ":" + to2DigitString(minutes);
  
  /**
   * 時間割を追加する
   */
  const addTimetable = async () => {
    // 定数
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

    // 各種データを取っておく
    const targetUrlPrefix = "https://letus.ed.tus.ac.jp/course/view.php?id=";
    const courseId2Name = new Map(Array.from($("#block-region-side-pre ul a"))
      .filter(el => el.href.startsWith(targetUrlPrefix))
      .map(el => [+el.href.slice(targetUrlPrefix.length), el.textContent]));

    const nowTime = (() => {
      const calcMinutes = (hour, minute) => hour * 60 + minute;
      const nowDate = new Date();
      const nowMinutes = calcMinutes(nowDate.getHours(), nowDate.getMinutes());
      let day = undefined;
      if (1 <= nowDate.getDay() && nowDate.getDay() <= 5)
        day = days[nowDate.getDay() - 1];
      let period = periods.findIndex(p => nowMinutes < calcMinutes(...p.end));
      period = period === -1 ? undefined : period;
      const status = period === undefined ? "finished" : calcMinutes(...periods[period].begin) <= nowMinutes ? "running" : "waiting";
      return { day, period, status };
    })();

    // 描画
    const createWeeklyTimetable = () => `
      <${"style"}>
        .letusbd-table {
          width: 100%;
          table-layout: fixed;
        }
        .letusbd-table-c-day {
          min-width: calc((10vw - 64px) / ${Object.values(daysDisplay).filter(d => d).length});
          text-align: center;
          font-weight: bold;
        }
        .letusbd-table-c-day[data-highlight="true"] {
          background-color: white;
        }
        .letusbd-table-c-period {
          width: 64px;
        }
        .letusbd-table-r-period {
          position: relative;
          height: max(100%, 96px);
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
          background-color: cornsilk;
        }
        .letusbd-table-subject[data-highlight="waiting"] {
          background-color: white;
        }
      </${"style"}>

      <div class="card-text mt-3">
        <div class="block-overview block-cards">
          <table class="letusbd-table" rules="all">
            <tr>
              <td class="letusbd-table-c-period"></td>
              ${days.filter(d => daysDisplay[d]).map(d => `
                <td class="letusbd-table-c-day" data-highlight="${nowTime.day === d}">
                  ${{
                    "monday": "月",
                    "tuesday": "火",
                    "wednesday": "水",
                    "thursday": "木",
                    "friday": "金",
                    "saturday": "土"
                    }[d]}
                </td>
              `).join("")}
            </tr>
            ${[...new Array(periodRange.last - periodRange.first + 1).keys()]
              .map(i => i + periodRange.first).map(p => `
                <tr>
                  <td class="letusbd-table-r-period" data-highlight="${nowTime.period === p}">
                    <div class="letusbd-table-r-period-content">
                      <span>${toStringTime(...periods[p].begin)}</span>
                      <b>${p + 1}</b>
                      <span>${toStringTime(...periods[p].end)}</span>
                    </div>
                  </div>
                  </td>
                    ${days.filter(d => daysDisplay[d]).map(d => `
                      <td class="letusbd-table-subject" data-highlight="${(nowTime.period === p && nowTime.day === d) && nowTime.status}">
                        ${!courses[d][p] ? `` : `
                          <a href=${targetUrlPrefix + courses[d][p]}>
                            ${courseId2Name.get(courses[d][p])}
                          </a>
                        `}
                      </td>
                    `).join("")}
                </tr>
              `).join("")}
          </table>
        </div>
      </div>
    `;

    $("#block-region-content").prepend(`
      <section class="block_myoverview block card mb-3">
        <div class="card-body p-3">
          <h5 class="card-title d-inline">時間割</h5>
          ${createWeeklyTimetable()}
        </div>
      </section>
    `);
  };
  
  /**
   * タイムラインブロックを操作する
   */
  const modifyTimelineBlock = async () => {
    // 安全のため，対応するタイムラインブロックは 1 つだけにする
    const $1 = args => {
      const ret = $(args);
      return ret.length === 1 ? $(ret[0]) : undefined;
    };
    const waitForLoading = async time => {
      await wait(() => $1(`div[data-region="event-list-loading-placeholder"]`).attr("class") === "hidden");
      if (time)
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    // 適当に待機しないとうまくいかない・・・
    // イベントを発火させず直接変更することもできるはずだが、それらしい関数が見当たらなかったので雑実装
    await waitForLoading();
    if (displayedSubmissions != 5) {
      $1(`div[class="block-timeline"] .dropdown-item[data-limit="${displayedSubmissions}"]`).click();
      await waitForLoading(true);
    }
    if (submissionLimit != 7) {
      $1(`div[class="block-timeline"] .dropdown-item[data-to="${submissionLimit}"]`).click();
      await waitForLoading(true);
    }
  };
  
  /**
   * main
   */
  (async () => {
    // LETUS の jQuery の読み込みを待機
    await wait(() => "$" in window);
    
    // 安全装置
    // * https://letus.ed.tus.ac.jp/my/ と完全一致する場合のみ実行
    // * LETUS 側のカスタマイズ機能使用中は動作しない
    if (location.href !== "https://letus.ed.tus.ac.jp/my/" || $(`button:contains("このページをカスタマイズする")`).length !== 1)
      return;
    
    /*
     * 実行
     */
    if (enableTimetable)
      addTimetable();
    if (enableTimelineBlockModifier)
      modifyTimelineBlock();
  })();
  
})();
