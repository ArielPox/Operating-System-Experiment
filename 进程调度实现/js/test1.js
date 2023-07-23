$(function() {
    // 定义进程类
    class Process {
        constructor(id, arrivalTime, burstTime, priority) {
            this.id = id; // 进程ID
            this.arrivalTime = arrivalTime; // 到达时间
            this.burstTime = burstTime; // 执行时间
            this.priority = priority; // 优先级
            this.remainingTime = burstTime; // 剩余执行时间
        }
    }

    /* 1.首先生成一个4-8之间的一个随机数，表示进程的数量 */
    let numOfProcess = Math.floor(Math.random() * 3) + 4;
    console.log(numOfProcess); //输出随机数
    /* 3.分别为随机出来的进程添加姓名 添加随机的到达时间 完成时间，优先级 */
    let NameSeed = "ABCDEFGH";
    // 设置一个队列将生成进程放入到队列中
    let processes = [];
    for (let i = 0; i < numOfProcess; i++) {
        // 生成到达时间
        let ArriTime = Math.floor(Math.random() * 8) + 1;
        // 生成的是执行的时间
        let ExeCuTime = Math.floor(Math.random() * 21) + 1;
        // 生成优先级
        let Prior = Math.floor(Math.random() * numOfProcess);
        var ProceName = "";
        ProceName += NameSeed[i];
        let PCB = new Process(ProceName, ArriTime, ExeCuTime, Prior);
        // 将进程放入到队列中存放
        processes.push(PCB);
    }

    console.log(processes);
    // 循环遍历每个对象，为每个对象创建一行，并将其属性添加到该行中的单元格
    // 获取表格
    var mytable = document.querySelector('.mytable')

    for (let i = 0; i < processes.length; i++) {
        // 创建tr行
        var tr = document.createElement('tr');
        mytable.append(tr);
        // 将进程对象中的属性读取到表格上面
        for (let k in processes[i]) {
            var td = document.createElement('td');
            // 将属性的值放在单元格里面
            td.innerHTML = processes[i][k];
            tr.append(td);
        }

    }
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
    // 定义时间片
    const timeSlice = prompt("输入一个恰当的时间片");

    // 进程复制一份用于轮转调度方法
    let processesCopy = [];
    for (let i of processes) {
        processesCopy.push(i)
    }

    // 定义进程队列
    let readyQueue = [];
    readyQueue.push(processes.shift());
    let runningQueue = [];
    let finishQueue = [];
    let showQueue = [];


    // 轮转调度算法提供相同进程
    let ReadyQueueOfRound = [];
    ReadyQueueOfRound.push(processesCopy.shift());
    let runningQueueOfRound = [];
    let ShowQueueOfRound = [];
    let finishQueueOfRound = [];

    // 监听事件
    var PrioritySchedule = document.querySelector('.PrioritySchedule');
    var RoundRobinSchedule = document.querySelector('.RoundRobinSchedule');
    let prioriShowul = document.querySelector("#PriShow");

    let RoundRobinShowul = document.querySelector("#RoundRobinShow");
    // 定义时间计数器
    let currentTime = readyQueue[0].arrivalTime;
    // 获取按钮事件完成优先级调度方法
    PrioritySchedule.addEventListener('click', function() {
        while (RoundRobinShowul.firstChild) {
            RoundRobinShowul.removeChild(RoundRobinShowul.firstChild);
        }
        // 执行进程调度
        while (readyQueue.length > 0 || runningQueue.length > 0) {
            // 将到达时间为当前时间的进程加入就绪队列
            while (processes.length > 0 && processes[0].arrivalTime <= currentTime) {
                readyQueue.push(processes.shift());
            }
            if (readyQueue.length > 0) {
                runningQueue.push(readyQueue.shift());
            }

            // 运行当前进程一个时间片
            if (runningQueue.length > 0) {
                let runningProcess = runningQueue.shift();
                let timer = Math.min(runningProcess.remainingTime, timeSlice);
                console.log("执行进程" + runningProcess.id);
                showQueue.push(runningProcess.id);
                runningProcess.remainingTime -= timer;
                currentTime += timer;
                runningProcess.priority -= 1;
                // 如果当前进程执行完毕，则将其从运行队列中移除，加入完成队列
                if (runningProcess.remainingTime <= 0) {
                    runningProcess.status = "finish";
                    console.log("完成进程" + runningProcess.id);
                    finishQueue.push(runningProcess);
                    runningProcess = null;
                }
                // 否则，重新入队
                else {
                    runningQueue.push(runningProcess);
                    runningQueue.sort((a, b) => b.priority - a.priority);
                }
            }
            currentTime += timeSlice
        }
        // console.log(prioriShowul);
        for (let i of showQueue) {

            let li = document.createElement('li');
            li.innerHTML = "" + i + "";
            prioriShowul.appendChild(li);
        }

        console.log(finishQueue);
        console.log("------------------------优先级调度所有进程执行完毕----------------------------");
    })

    console.log(processesCopy, runningQueueOfRound, ReadyQueueOfRound);
    //---------------------------- 执行时间片轮转调度
    let currentTimeOfRound = ReadyQueueOfRound[0].arrivalTime;
    RoundRobinSchedule.addEventListener('click', function() {
        while (prioriShowul.firstChild) {
            prioriShowul.removeChild(prioriShowul.firstChild);
        }
        // 执行进程调度
        while (ReadyQueueOfRound.length > 0 || runningQueueOfRound.length > 0) {
            // 将到达时间为当前时间的进程加入就绪队列
            while (processesCopy.length > 0 && processesCopy[0].arrivalTime <= currentTimeOfRound) {

                ReadyQueueOfRound.push(processesCopy.shift());
            }

            if (ReadyQueueOfRound.length > 0) {
                // 新到达的进程要在队列的前面
                runningQueueOfRound.unshift(ReadyQueueOfRound.shift());
            }

            // 运行当前进程一个时间片
            if (runningQueueOfRound.length > 0) {
                let runningProcessOfRound = runningQueueOfRound.shift();
                let timer = Math.min(runningProcessOfRound.remainingTime, timeSlice);
                console.log("执行进程" + runningProcessOfRound.id);
                ShowQueueOfRound.push(runningProcessOfRound.id);
                runningProcessOfRound.remainingTime -= timer;
                currentTimeOfRound += timer;
                // 如果当前进程执行完毕，则将其从运行队列中移除，加入完成队列
                if (runningProcessOfRound.remainingTime <= 0) {
                    runningProcessOfRound.status = "finish";
                    console.log("完成进程" + runningProcessOfRound.id);
                    finishQueueOfRound.push(runningProcessOfRound);
                    runningProcess1 = null;
                }
                // 否则，重新入队
                else {
                    runningQueueOfRound.push(runningProcessOfRound);
                }
            }
        }
        for (let j of ShowQueueOfRound) {
            let liOfRound = document.createElement('li');
            liOfRound.innerHTML = "" + j + "";
            RoundRobinShowul.appendChild(liOfRound);
        }
        console.log("---------------时间片轮转调度结束------------------------");
    })
})