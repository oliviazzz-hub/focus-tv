
/*
const startButtons = document.querySelectorAll(".btn-start");
/* document指代整个html页面；
document,querySelectorAll(sth) 返回 一个装着整个html中所有.btn-start class的元素的列表

/* console.log(startButtons); ——检查button列表是否正确登入

startButtons.forEach((button) => {  
    button.addEventListener("click", () => { 
        const timerSection = button.closest(".timer"); 
        const tier = timerSection.dataset.tier; 
        console.log(`第 ${tier} 档计时器的开始按钮被点击了`);
    });
});*/


window.addEventListener("DOMContentLoaded", () => {

    //console.log("script.js 已加载"); /*打印到控制台console的交互信息 */
    
    /* 试验：只跟踪开始按钮。
    const startButtons = document.querySelectorAll(".btn-start");

    startButtons.forEach((button) => {  /* 对所有列表里的元素button批量操作 
        button.addEventListener("click", () => {  /* 收到点击信号时 
            const timerSection = button.closest(".timer");  /* closest是顺着嵌套结构找最近的timer类上级 
            const tier = timerSection.dataset.tier;  /* 这个timer的data-tier 
            console.log(`第 ${tier} 档计时器的开始按钮被点击了`);
        });
    });q*/

    const timerSections = document.querySelectorAll(".timer");  // 所有timer类的对象组成一个列表

    timerSections.forEach((section) => {  // timerSections列表的所有元素批量操作（每个被命名为一个section）
        // 简称一些属性
        const tier = section.dataset.tier;
        const display = section.querySelector(".timer-display");  // 这是一个文字类，<p>那种
        const controls = section.querySelector(".timer-controls");  

        // 每个计时器自己的状态,存在一个对象里
        const state = {
            status: "idle", // idle / running / paused
            elapsedSeconds: 0,
            intervalId: null, // 找到上一个在用的计时器
        };

        // “流逝秒数”->时钟显示。
        function updateDisplay() {
            const h = String(Math.floor(state.elapsedSeconds / 3600)).padStart(2, "0");
            const m = String(Math.floor((state.elapsedSeconds % 3600) / 60)).padStart(2, "0");
            const s = String(state.elapsedSeconds % 60).padStart(2, "0");  //左侧补0至两位数字
            display.textContent = `${h}:${m}:${s}`;  // textContent是内置属性不是自定义
        }

        // 按钮渲染。计时器状态分类->按钮对应显示。
        // idle -> 【开始】；running -> 【暂停】；paused -> 【继续】【结束】。
        function renderButtons() {
            if (state.status === "idle") {
                controls.innerHTML = `<button class="btn-start">开始</button>`;
            } else if (state.status === "running") {
                controls.innerHTML = `<button class="btn-pause">暂停</button>`;
            } else if (state.status === "paused") {
                controls.innerHTML = `
                <button class="btn-resume">继续</button>
                <button class="btn-end">结束</button>
                `;
            }
        }

        //以下开始做状态转移所需函数

        function startTimer() {
            if (state.status === "idle") {
                state.startTimestamp = new Date().toISOString();  
                // 创建一个"当前时间"的 Date 对象，再用 .toISOString() 把它转换成 ISO 8601 格式字符串
            }
            state.status = "running";  // 覆盖状态
            state.intervalId = setInterval(() => {  // java内置函数，定时（1000ms）重复执行
                state.elapsedSeconds++;
                updateDisplay();  // 直接依赖于elapsedSeconds
            }, 1000);
            renderButtons();
        }

        function pauseTimer() {
            state.status = "paused";
            clearInterval(state.intervalId);  // 暂停该setInterval()函数的进程，但不清空。
            renderButtons();
        }

        function resumeTimer() {
            startTimer();  // 暂时，“继续”的功能和从零“开始”没有区别。
        }

        function endTimer() {
            const session = {
                id: "session-" + Date.now(),  // 内置方法，返回"从 1970 年 1 月 1 日到现在，经过的毫秒数"
                tier: tier,
                startTime: state.startTimestamp,
                endTime: new Date().toISOString(),  // 和startTime一样实时创建，不过它俩创立的时间不一样
                totalTime: state.elapsedSeconds,
                blankTime: 0,  // 直接创立的原始session是没有空白段落的
                tag: null,
                note: "",
                dayId: null,
            };

            const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
            // JSON.parse: Converts a JavaScript Object Notation (JSON) string into an object.
            // 如果 getItem 返回了东西就用那个，
            // 如果返回的是 null（比如你是第一次用这个工具，之前从没存过任何 session），就用一个空数组的字符串 "[]" 代替。
            sessions.push(session);
            localStorage.setItem("sessions", JSON.stringify(sessions));
            // JSON.stringify： Converts a JavaScript value to a JavaScript Object Notation (JSON) string.

            console.log("已保存一条记录：", session);
            console.log("当前所有记录：", sessions);

            state.status = "idle";
            state.elapsedSeconds = 0;
            updateDisplay();
            renderButtons();
        }

        // 用"事件委托"监听整个按钮区域,而不是每个按钮单独绑定
        controls.addEventListener("click", (event) => {
            if (event.target.matches(".btn-start")) startTimer();
            else if (event.target.matches(".btn-pause")) pauseTimer();
            else if (event.target.matches(".btn-resume")) resumeTimer();
            else if (event.target.matches(".btn-end")) endTimer();
        });


    });


});
