export function getWindowWidth() {
    return window.innerWidth;
}

export function getDivResize(parentClass) {

    let parent_width = document.querySelector(parentClass).offsetWidth,
        parent_height = document.querySelector(parentClass).offsetHeight,
        width = 0,
        height = 0,
        windowWidth = window.innerWidth;

        // console.log(parent_width)

    if(parent_width<parent_height+500){
        // console.log('寬小於高')
        // console.log(windowWidth)

        if(windowWidth <= 1024){
            width = parent_width/1.3;
            height = parent_width/1.2;
        }else{
            width = parent_width/1.3;
            height = parent_width/3.9;
        }
       
    }else{
        // console.log('寬大於高')
        width = parent_height/0.7;
        height = parent_height/2.1;
    }

    return { width, height };
}