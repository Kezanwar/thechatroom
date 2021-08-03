

const colorPicker = document.getElementById('favcolor');

// Listening to the change of the color picker value on input and changing the UI elements accordingly

export function colorPickerInput() {

    colorPicker.addEventListener('input', function () {

        let color = colorPicker.value


        const colorChange = document.querySelectorAll('.col-change');
        const bgChange = document.querySelectorAll('.bg-change');

        colorChange.forEach(element => {

            element.style.color = color;


        })
  
        bgChange.forEach(element => {

            element.style.backgroundColor = color;
            element.style.boxShadow = "1px 1px 12px" + color + "71  ";

        })



    })

};

export function colorPickerToUI(color) {
    


   
        const colorChange = document.querySelectorAll('.col-change');
        const bgChange = document.querySelectorAll('.bg-change');

        colorChange.forEach(element => {

            element.style.color = color;


        })
  
        bgChange.forEach(element => {

            element.style.backgroundColor = color;
            element.style.boxShadow = "1px 1px 12px" + color + "71  ";

        })



};



export function hexToRGB() {


    let hex = colorPicker.value
    var r, g, b;
    if (hex.charAt(0) == '#') {
      hex = hex.substr(1);
    }
    if (hex.length == 3) {
      hex = hex.substr(0, 1) + hex.substr(0, 1) + hex.substr(1, 2) + hex.substr(1, 2) + hex.substr(2, 3) + hex.substr(2, 3);
    }
    r = hex.charAt(0) + '' + hex.charAt(1);
    g = hex.charAt(2) + '' + hex.charAt(3);
    b = hex.charAt(4) + '' + hex.charAt(5);
    r = parseInt(r, 16);
    g = parseInt(g, 16);
    b = parseInt(b, 16);

    return (r + g + b);

};

