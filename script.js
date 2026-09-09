console.log("script.js 已加载"); /*打印到控制台console的交互信息 */

const startButtons = document.querySelectorAll(".btn-start");
/* document指代整个html页面；
document,querySelectorAll(sth) 返回 一个装着整个html中所有.btn-start class的元素的列表*/

/* console.log(startButtons); ——检查button列表是否正确登入*/

startButtons.forEach((button) => {  /* 对所有列表里的元素button批量操作 */
    button.addEventListener("click", () => { /* 收到点击信号时 */
        const timerSection = button.closest(".timer"); /* closest是顺着嵌套结构找最近的timer类上级 */
        const tier = timerSection.dataset.tier; /* 这个timer的data-tier */
        console.log(`第 ${tier} 档计时器的开始按钮被点击了`);
    });
});