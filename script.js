const size = 10;
const nums = [];
createArr();
const info = new Map();
fillMap(info);

//sets base color to black for all bars
function fillMap(info) {
    for (i = 0; i < size; i++) {
        info.set(i, "black");
    }
}

//create bar graph to be sorted
function createArr() {
    for (let i = 0; i < size; i++) {
        nums[i] = Math.random();
    }
    updateDisplay();
}

//displays the bar graph to be sorted
function updateDisplay(info) {
    container.innerHTML = "";
    for (let i = 0; i < size; i++) {
        const bar = document.createElement("div");
        bar.style.height = nums[i] * 100 + "%";
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
    quicksort(nums, 0, 9);
    //sets all to black
    updateDisplay();
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
    let lPoint = start - 1;
    let rPoint = end + 1;
    var animations = [];
    animations.push([start, "green"]);

    while (true) {
        do {
            lPoint++;
            //set current index bar to red. if prev is red, set to black
            if (lPoint >= 0 && lPoint <= end) {
                //change to red
                animations.push([lPoint, "red"]);
                //if prev bar is in range, change to black
                if (lPoint - 1 >= 0 && info.get(lPoint) != "green") {
                    animations.push([lPoint - 1, "black"]);
                }
                //updateDisplay(info);
            }
        } while (nums[lPoint] < pivot);
        //once we get all animations for that movement, animate()? OR we can wait until end of entire partition and then animate

        //set blue at lPoint
        if (lPoint >= 0 && lPoint <= end) {
            animations.push([lPoint, "blue"]);
            //updateDisplay(info);
        }

        do {
            rPoint--;
            //set current index to red. if prev(+1) is red, set to black
            if (rPoint > 0 && rPoint <= end) {
                animations.push([rPoint, "red"]);
                //if prev bar is in range, change to black
                if (rPoint + 1 <= end) {
                    animations.push([rPoint + 1, "black"]);
                }
                //updateDisplay(info)
            }
        } while (nums[rPoint] > pivot);
        //set blue at rPoint
        if (rPoint >= 0 && rPoint <= end) {
            animations.push([rPoint, "blue"]);
            //updateDisplay(info);
        }

        if (lPoint >= rPoint) {
            //set everything back to black
            //updateDisplay();
                animate(animations);
            return rPoint;
        }
        //swap
        animations.push([lPoint, rPoint]);
        let temp = nums[lPoint];
        nums[lPoint] = nums[rPoint];
        nums[rPoint] = temp;

        //set start back to green again
        if (info.get(start) != "green") {
            animations.push([start, "green"]);
            //updateDisplay(info);
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
            let temp = nums[index];
            nums[index] = nums[colorOrNum];
            nums[colorOrNum] = temp;
        }
        updateDisplay(info);
        setTimeout(function() {
            animate(animations);
        }, 100);

        
    }
}