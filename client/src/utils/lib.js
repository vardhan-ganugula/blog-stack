export const debounce = (fn, time) => {

    let timer;


    return (...args) => {
        clearInterval(timer);
        timer = setTimeout(() => fn(...args), time);
    }


}