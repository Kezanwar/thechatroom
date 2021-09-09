// toggle function for sidebar modal functionality with modal background for smaller screens.
// menu button and modal background have are stored in menuToggles

// DOM ELEMENTS

const sidebar = document.getElementById('sidebar');
const frostedBg = document.getElementById('frostedBg');

const menuToggles = document.querySelectorAll('.sidebar__toggle');

function sidebarFunctionality () {
    menuToggles.forEach(element => {
  
        element.addEventListener('click', function () {

            sidebar.classList.toggle('main__sidebar__move');
            frostedBg.classList.toggle('frostedBgToggle');

        })

    })
};

export default sidebarFunctionality