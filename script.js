var size = 10;
var delay = document.getElementById("speed").value * -1;
var nums = [];
var copy;
var restart;
var numSwaps = 0;
var numComparisons = 0;
var sortType = "quicksort";
createArr();
const info = new Map();
var barSet;
reset(info);
var animations = [];
var adversary = false;

//sets base color to black for all bars
function reset(info) {
    var color;
    if (adversary == false) {
        color = "black";
    } else {
        color = "gray"
    }
    for (i = 0; i < size; i++) {
        info.set(i, color);
    }
}

//create bar graph to be sorted
function createArr() {
    if (adversary == null) {
        adversary = false;
    }
    if (adversary == false) {
        for (let i = 0; i < size; i++) {
            nums[i] = Math.random();
        }
    } else {
        for (let i = 0; i < size; i++) {
            nums[i] = 0.5;
        }
    }
    numSwaps = 0;
    numComparisons = 0;
    copy = [...nums]
    restart = [...nums]
    updateDisplay();
}

//sorts the bar graph
function play() {
    getSortType();
    //sets all to black
    initStopwatch();
    updateDisplay();
    animate(animations);
}

//resets sort to original
function restartSort() {
    var largeID = setTimeout(";");
    for (var i = 0 ; i < largeID ; i++) {
        clearTimeout(i); 
    }
    animations = [];
    nums = restart;
    copy = [...nums];
    restart = [...nums];
    numSwaps = 0;
    numComparisons = 0;
    document.getElementById('numberOfComparisons').innerHTML = "Number of Comparisons: " + 0;
    document.getElementById('numberOfSwaps').innerHTML = "Number of Swaps: " + 0;
    document.getElementById('timer').innerHTML = "Time: 00:00:00"
    updateDisplay();
}

function getSortType() {
    sortType = document.getElementById('types').value;
    console.log(sortType);
    if (sortType == "quicksort") {
        toggleAdversary();
        return quicksort(nums, 0, size - 1);
    } else if (sortType == "selection") {
        removeAdversary();
        return selectionSort(nums, size);
    } else if (sortType == "bubble") {
        removeAdversary();
        return bubbleSort(nums, size);
    } else if (sortType == "insert") {
        removeAdversary();
        return insertionSort(nums, size);
    }
}

//displays the bar graph to be sorted
function updateDisplay(info) {
    barSet = new Map();
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
        } else if (adversary == true) {
            setColor("gray", bar);
        }
        barSet.set(i, bar);
        container.appendChild(bar);
    }
}

//set bar color
function setColor(curColor, bar) {
    bar.style.backgroundColor = curColor;
}

//standard quicksort, using hoare partitioning
function quicksort(nums, start, end) {
    if (start < end) {
        if (adversary == false) {
            let partition = hoarePartition(nums, start, end);
            quicksort(nums, start, partition);
            quicksort(nums, partition + 1, end);
        } else {
            let partition = adversaryHoarePartition(nums, start, end);
            quicksort(nums, start, partition);
            quicksort(nums, partition + 1, end);
            animations.push([end, "black"]);
        }
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
            numComparisons++;
            animations.push(["compare", numComparisons]);
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
            numComparisons++;
            animations.push(["compare", numComparisons]);
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
            numSwaps++;
            animations.push(["swap", numSwaps]);
        } else {
            //swap pivot with rPoint, end condition
            animations.push([start, rPoint]);
            let temp = pivot;
            nums[start] = nums[rPoint];
            nums[rPoint] = temp;
            reset(info);
            numSwaps++;
            animations.push(["swap", numSwaps]);

            //animate(animations);
            return rPoint;
        }
    }
}

//bubble sort. keep swapping until end of array. repeat, reducing length by 1 each time.
function bubbleSort(nums, size) {
    for (i = 0; i < size; i++) {
        let swapped = false;
        for (j = 0; j < size - i - 1; j++) {
            //make j, j + 1st index red
            animations.push([j, "red"]);
            animations.push([j + 1, "red"]);
            //add 1 comparison
            numComparisons++;
            animations.push(["compare", numComparisons]);
            if (nums[j] > nums[j + 1]) {
                //swap with larger element
                let temp = nums[j];
                nums[j] = nums[j + 1];
                nums[j + 1] = temp;
                swapped = true;
                //turn both blue, then swap.
                animations.push([j, "blue"]);
                animations.push([j + 1, "blue"]);
                animations.push([j, j + 1]);
                //add 1 swap
                numSwaps++;
                animations.push(["swap", numSwaps]);
            } else {
                //turn j black.
                animations.push([j, "black"]);
            }
        }
        if (swapped == false) {
            break;
        }
    }
}

//
function selectionSort(nums, size) {
    for (i = 0; i < size - 1; i++) {
        //index to swap is i, iterate throughout
        let minimumIndex = i;
        //set minimumIndex to green
        animations.push([minimumIndex, "green"]);
        for (j = minimumIndex + 1; j < size; j++) {
            //set j to red
            if (info.get(j) != "red") {
                info.set(j, "red");
                animations.push([j, "red"]);
            }
            //set previous j to black, if applicable
            if (j - 1 >= 0 && info.get(j - 1) == "red") {
                info.set(j - 1, "black");
                animations.push([j - 1, "black"]);
            }
            //add 1 comparison
            numComparisons++;
            animations.push(["compare", numComparisons]);
            if (nums[minimumIndex] > nums[j]) {
                //set both to blue
                info.set(minimumIndex, "blue");
                info.set(j, "blue");
                animations.push([minimumIndex, "blue"]);
                if (minimumIndex != j) {
                    animations.push([j, "blue"]);
                }
                //set old minimum index to black
                info.set(minimumIndex, "black");
                animations.push([minimumIndex, "black"]);
                minimumIndex = j;
                //set new minimum index to green
                info.set(j, "green");
                animations.push([j, "green"]);
            }
        }
        //swap smallest to index i
        let temp = nums[i];
        nums[i] = nums[minimumIndex];
        nums[minimumIndex] = temp;
        animations.push([i, minimumIndex]);
        //add 1 swap
        numSwaps++;
        animations.push(["swap", numSwaps]);
    }
    reset(info);
}

//sorted array is at front, shift items back until they're in place
function insertionSort(nums, size) {
    var sortedNum;
    var cur;
    for (i = 1; i < size; i++) {
        sortedNum = i - 1;
        cur = nums[i];
        //highlight cur
        info.set(cur, "blue");
        animations.push([cur, "blue"]);
        //compare cur to each element on its left until an element that's smaller is found
        while (sortedNum >= 0 && nums[sortedNum] > cur) {
            nums[sortedNum + 1] = nums[sortedNum];
            sortedNum--;
        }
        var copyI = i;
        while (copyI != sortedNum + 1 && copyI - 1 >= 0) {
            animations.push([copyI, copyI - 1]);
            //make copyI - 1 blue, make copyI black
            animations.push([copyI, "black"]);
            animations.push([copyI - 1, "red"]);
            copyI--;
            //increase swaps, comps
            numComparisons++;
            animations.push(["compare",numComparisons]);
            numSwaps++;
            animations.push(["swap", numSwaps]);
        }
        nums[sortedNum + 1] = cur;
        animations.push([sortedNum + 1, "green"]);
        animations.push([sortedNum + 1, "black"]);
    }
    updateDisplay();
}

//runs killer adversary to quicksort
function adversarialqs() {
    adversary = true;
    createArr();
    updateDisplay();
    console.log(adversary);
    for (i = 0; i < size; i++) {
        info.set(i, "gray");
    }
    console.log(info.get(1));
    //hoare, so pivot is furthest left.
}


//given a list of swaps [index, index], comparison/swaps [compare/swap, numberofcomp/swap] or color changes [index, color]
function animate(animations) {
    if (animations.length == 0) {
        endStopwatch();
        return;
    }
    const [index, colorOrNum] = animations.shift();
    //if it's a index, color combo, then change info.
    if (typeof colorOrNum === "string") {
        info.set(index, colorOrNum);
    } else if (typeof index === "string") {
        if (index == "compare") {
            document.getElementById('numberOfComparisons').innerHTML = "Number of Comparisons: " + colorOrNum;
        } else if (index == "swap") {
            document.getElementById('numberOfSwaps').innerHTML = "Number of Swaps: " + colorOrNum;
        }
    } else if (typeof index === "number" && typeof colorOrNum === "number") {
        //swap 
        let temp = copy[index];
        copy[index] = copy[colorOrNum];
        copy[colorOrNum] = temp;
        reset(info);
        updateDisplay();
    } else {
        //set bar height
        index.style.height = colorOrNum * 100 + "%";
    }
    updateDisplay(info);
    var animationLoop = setTimeout(function() {animate(animations);}, delay);
    
}


//create timer
var startTime;
var interval;

function displayHelper(number) {
    // add a 0 if less than 10
    return (number < 10 ? "0" : "") + number;
}

function initStopwatch() {
    if (!interval) {
        startTime = new Date().getTime();
        interval = setInterval(stopwatch, 1); 
      }
}

function stopwatch() {
    var measuredTime = new Date().getTime() - startTime;
    var minutes = Math.floor(measuredTime / 1000 / 60) % 60;
    var seconds = Math.floor(measuredTime / 1000) % 60;
    var milliseconds = Math.floor(measuredTime) % 60;
    document.getElementById('timer').innerHTML = "Time: " + displayHelper(minutes) + ":" + displayHelper(seconds) + ":" + displayHelper(milliseconds);
}

function endStopwatch() {
    clearInterval(interval); 
    interval = null;
}

//changes speed w/ speed slider
function updateSpeed() {
    delay = document.getElementById("speed").value * -1;
    //console.log(document.getElementById("speed").value);
    //console.log(delay);
}

//changes size w/ size slider
function updateSize() {
    size = document.getElementById("size").value ;
    createArr();
    console.log(document.getElementById("size").value);
    console.log(size);
}

//gets random number between max (exclusive) and min (inclusive)
function getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

//toggles quicksort adversary animation button
function toggleAdversary() {
    if (document.getElementById("adversary") == null) {
        const killerQS = document.createElement('button');
        killerQS.textContent = 'Click me!';
        killerQS.setAttribute("id", "adversary");
        killerQS.onclick = adversarialqs();
        document.getElementById("buttons").appendChild(killerQS);
    }
}

//removes the quicksort adversary button
function removeAdversary() {
    if (document.getElementById("adversary") != null) {
        var button = document.getElementById("adversary");
        document.getElementById("adversary").parentNode.removeChild(document.getElementById("adversary"));
    }


}

//hoare partitions, with gases and solids.
//gas = gray. blue = set (stops moving during blah), red = moving, green = pivot, black = solid.
//compare
function adversaryHoarePartition(nums, start, end, curMin) {
    let pivot = nums[start];
    let lPoint = start + 1;
    let rPoint = end;

    //set start bar height
    //animatinos.push[start, height]
    let startBar = barSet.get(start);
    let startBarHeight = getRandomBetween(curMin, 1);
    animations.push([startBar, startBarHeight]);
    //sets start to green
    info.set([start, "green"]);
    animations.push([start, "green"]);

    while (true) {
        //set left pointer to blue
        if (lPoint >= 0 && lPoint <= end) {
            info.set(lPoint, "blue");
            animations.push([lPoint, "blue"]);
        }

        //move right pointer
        while (rPoint > start) {
            //set current index to red. if prev(+1) is red, set to black
            if (info.get(rPoint) != "blue") {
                info.set(rPoint, "red");
                animations.push([rPoint, "red"]);
                //if prev bar is in range, change to black
                if (rPoint + 1 <= end && info.get(rPoint + 1) == "red") {
                    info.set(rPoint + 1, "gray");
                    animations.push([rPoint + 1, "gray"]);
                }
            }
            rPoint--;
            numComparisons++;
            animations.push(["compare", numComparisons]);
        }
        //rPoint stops. set to blue.
        if (rPoint >= 0 && rPoint <= end) {
            info.set(rPoint, "blue");
            animations.push([rPoint, "blue"]);
        }
        //set previous to black if necessary.
        /*if (rPoint + 1 <= end && info.get(rPoint + 1) == "red") {
            info.set(rPoint + 1, "black");
            animations.push([rPoint + 1, "black"]);
        }*/
        //swap pivot with rPoint, end condition. rPoint = pivot. set pivot to green. set lPoint to blue
        info.set(rPoint, "green");
        animations.push([rPoint, "green"]);
        console.log(rPoint == start);
        info.set(lPoint, "gray");
        animations.push([lPoint, "gray"]);
        info.set(rPoint, "black");
        animations.push([rPoint, "black"]);
        numSwaps++;
        animations.push(["swap", numSwaps]);

        //animate(animations);
        
        return rPoint;
        
    }
}


    
