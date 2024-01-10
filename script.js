const size = 20;
var delay = 50;
var nums = [];
var copy;
createArr();
const info = new Map();
reset(info);
var animations = [];

//sets base color to black for all bars
function reset(info) {
    for (i = 0; i < size; i++) {
        info.set(i, "black");
    }
}

//create bar graph to be sorted
function createArr() {
    for (let i = 0; i < size; i++) {
        nums[i] = Math.random();
    }
    copy = [...nums]
    updateDisplay();
}

//displays the bar graph to be sorted
function updateDisplay(info) {
    container.innerHTML = "";
    for (let i = 0; i < size; i++) {
        const bar = document.createElement("div");
        //bar.style.height = nums[i] * 100 + "%";
        bar.style.height = copy[i] * 100 + "%";
        bar.classList.add("bar");
        //change color here 
        if (info) {
            //check i's color in info, set accordingly
            let curColor = info.get(i);
            setColor(curColor, bar);
        }
        container.appendChild(bar);
    }
}

//set bar color
function setColor(curColor, bar) {
    if (curColor == "red") {
        bar.style.backgroundColor = "red";
    } else if (curColor == "black") {
        bar.style.backgroundColor = "black";
    } else if (curColor == "blue") {
        bar.style.backgroundColor = "blue";
    } else if (curColor == "green") {
        bar.style.backgroundColor = "green";
    }
}

//sorts the bar graph
function play() {
    quicksort(nums, 0, size - 1);
    //sets all to black
    updateDisplay();
    animate(animations);
}

//standard quicksort, using hoare partitioning
function quicksort(nums, start, end) {
    if (start < end) {
        let partition = hoarePartition(nums, start, end);
        quicksort(nums, start, partition);
        quicksort(nums, partition + 1, end);
    }
}

//choose leftmost as pivot. left pointer dislikes >=, right pointer dislikes <=
function hoarePartition(nums, start, end) {
    let pivot = nums[start];
    let lPoint = start + 1;
    let rPoint = end;
    //var animations = [];
    animations.push([start, "green"]);

    while (true) {
        //move left pointer
        while (lPoint <= end && nums[lPoint] < pivot) {
            //change colors
            //set current index to red. set prev (-1) to black if it's red.
            info.set(lPoint, "red");
            animations.push([lPoint, "red"]);
            //if prev bar is in range, change to black
            if (lPoint - 1 >= 0 && info.get(lPoint - 1) == "red") {
                info.set(lPoint - 1, "black");
                animations.push([lPoint - 1, "black"]);
            }
            lPoint++;
        }
        //left pointer stops. set to blue
        if (lPoint >= 0 && lPoint <= end) {
            info.set(lPoint, "blue");
            animations.push([lPoint, "blue"]);
        }
        //set behind to black if necessary.
        if (lPoint - 1 >= 0 && info.get(lPoint - 1) == "red") {
            info.set(lPoint - 1, "black");
            animations.push([lPoint - 1, "black"]);
        }

        //move right pointer
        while (rPoint >= start && nums[rPoint] > pivot) {
            //change colors
            //set current index to red. if prev(+1) is red, set to black
            info.set(rPoint, "red");
            animations.push([rPoint, "red"]);
            //if prev bar is in range, change to black
            if (rPoint + 1 <= end && info.get(rPoint + 1) == "red") {
                info.set(rPoint + 1, "black");
                animations.push([rPoint + 1, "black"]);
            }
            rPoint--;
        }
        //rPoint stops. set to blue.
        if (rPoint >= 0 && rPoint <= end) {
            info.set(rPoint, "blue");
            animations.push([rPoint, "blue"]);
        }
        //set previous to black if necessary.
        if (rPoint + 1 <= end && info.get(rPoint + 1) == "red") {
            info.set(rPoint + 1, "black");
            animations.push([rPoint + 1, "black"]);
        }

        if (lPoint < rPoint) {
            //swap, regular.
            animations.push([lPoint, rPoint]);
            let temp = nums[lPoint];
            nums[lPoint] = nums[rPoint];
            nums[rPoint] = temp;
            info.set(start, "green");
            animations.push([start, "green"]);
        } else {
            //swap pivot with rPoint, end condition
            animations.push([start, rPoint]);
            let temp = pivot;
            nums[start] = nums[rPoint];
            nums[rPoint] = temp;
            reset(info);

            //animate(animations);
            return rPoint;
        }
    }
}

    function animate(animations) {
        if (animations.length == 0) {
            return;
        }
        const [index, colorOrNum] = animations.shift();
        //if it's a index, color combo, then change info.
        if (typeof colorOrNum === "string") {
            info.set(index, colorOrNum);
        } else {
            //swap 
            let temp = copy[index];
            copy[index] = copy[colorOrNum];
            copy[colorOrNum] = temp;
            reset(info);
            updateDisplay();
        }
        updateDisplay(info);
        setTimeout(function() {
            animate(animations);
        }, delay);
        /*while(animations.length != 0) {
            animate(animations);
        }*/
        
    }
