console.log('Version >> ',window.myAPI.versions)
console.log('SayHello >> ',window.myAPI.sayHello())
const btn = document.getElementById('btn');
const input = document.getElementById('title');
const filePathElement = document.getElementById('filePath');
btn.addEventListener( 'click', async() => {
    let title = input.value;
    console.log('Btn Clicked');
    console.log('Title:', title);
    window.myAPI.setTitle(title);
    const filePath = await window.myAPI.openFile()
    filePathElement.innerText = filePath
});