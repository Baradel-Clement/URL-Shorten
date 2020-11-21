// Navbar start

const menuBtn = document.querySelector('.menu-btn');
const mobileOverlay = document.querySelector('.mobile-nav-overlay')
const mobileNavList = document.querySelector('.mobile-nav-list')
menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    mobileOverlay.classList.toggle('active')
    mobileNavList.classList.toggle('active')
});

//Navbar end 



// global variables
const shortenItBtn = document.getElementById('shortenIt');
const shortenSection = document.querySelector('.shorten-section');
const statisticsSection = document.getElementById('statistics-section');
const input = document.getElementById('linkInput');
let statisticsSectionHeight;
let statisticsSectionHeightDelta;
let inputPlaceholder = document.getElementsByName('linkInput')[0];

// Adjusting height of the container 

if (window.matchMedia("(min-width: 769px)").matches) {
    statisticsSection.style.height = "834px";
    statisticsSectionHeight = 834;
    statisticsSectionHeightDelta = 100;
} else if (window.matchMedia("(max-width: 768px)").matches) {
    statisticsSection.style.height = "1481px";
    statisticsSectionHeight = 1481;
    statisticsSectionHeightDelta = 200;
}

function successFunction(data, linkInputValue) {
    // Creating the new link component

    const newLink = document.createElement('div');
    let newLinkPosition;

    newLink.classList.add('shorten-link-component');
    statisticsSectionHeight+= statisticsSectionHeightDelta;
    statisticsSection.style.height = statisticsSectionHeight.toString() + "px"
    newLink.innerHTML = `
    <div class="shorten-link-component-wrap">
        <p class="link input-url">${linkInputValue}</p>
        <p class="link blue shorten-url">${data.result.short_link}</p>
    </div>
    <a class="button copy-button white">Copy</a>
    `;

    // Adjust position of the new link component

    if (window.matchMedia("(min-width: 769px)").matches) {
        let i = 1;
        newLink.style.bottom = "-100px";
        newLinkPosition = 100;
        if (shortenSection.children.length == 2) {
            i = 1
            newLink.style.bottom ="-" + (newLinkPosition * (i)).toString() + "px";
        } else {
            while (shortenSection.children.length != i) {
                i++;
            }
            newLink.style.bottom ="-" + (newLinkPosition * (i - 1)).toString() + "px";
        }
    } else if (window.matchMedia("(max-width: 768px)").matches) {
        let i = 1;
        newLink.style.bottom = "-200px";
        newLinkPosition = 200;
        if (shortenSection.children.length == 2) {
            i = 1
            newLink.style.bottom ="-" + (newLinkPosition * (i)).toString() + "px";
        } else {
            while (shortenSection.children.length != i) {
                i++;
            }
            newLink.style.bottom ="-" + (newLinkPosition * (i - 1)).toString() + "px";
        }
    }

    shortenSection.appendChild(newLink);

    // Clear input field

    document.getElementById('linkInput').value = ""
    inputPlaceholder.placeholder = "Shorten a link here..."
    shortenItBtn.innerHTML = "Shorten It!"
    input.classList.remove('error')

    // Copy feature

    let copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            copyButtons.forEach(button =>  {
                button.classList.remove('active');
                button.innerHTML = "Copy";
            });
            let range = document.createRange();
            let selection = window.getSelection();
            range.selectNodeContents(button.previousElementSibling.lastElementChild)           
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand("copy")
            button.classList.add('active');
            button.innerHTML = "Copied!"
        });
    })
};

function errorHandling(error) {
    let errorCode = error.responseJSON.error_code;
    const input = document.getElementById('linkInput');
    input.classList.add('error')
    if (errorCode == 1) {
        console.log(1)
        inputPlaceholder.placeholder = "Empty field";
    } else if (errorCode == 2) {
        inputPlaceholder.placeholder = "Invalid URL submitted";
    } else if (errorCode == 10) {
        inputPlaceholder.placeholder = "Trying to shorten a shortened link";
    } else {

    }

    // Reset input
    shortenItBtn.innerHTML = "Shorten It!"
    document.getElementById('linkInput').value = ""
}

function callApi() {
    // Calling API 

    const linkInputValue = document.getElementById('linkInput').value
    shortenItBtn.innerHTML = "Shortening..."
    let urlApi = `https://api.shrtco.de/v2/shorten?url=${linkInputValue}`;
    $.ajax({
        url: `https://api.shrtco.de/v2/shorten?url=${linkInputValue}`,
        type: "GET",
        success: function(data) {
            successFunction(data, linkInputValue);
        },
        error: function(error) {
            errorHandling(error)
        }
    });
}