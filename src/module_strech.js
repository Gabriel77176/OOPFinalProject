export function stretchGridDivs() {
    const gridDivs = document.querySelectorAll('.grid-div');

    let maxHeight = 0;

    gridDivs.forEach(div => {
        const computedStyle = window.getComputedStyle(div);

        const contentHeight = div.clientHeight - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom);

        maxHeight = Math.max(maxHeight, contentHeight);
    });

    gridDivs.forEach(div => {
        div.style.height = maxHeight + 'px';
    });
}