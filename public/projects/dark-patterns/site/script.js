// ANIMACIONES

const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

});

sections.forEach(section => {

    section.classList.add("fade");

    observer.observe(section);

});


// NOTIFICACIONES

const notifications = [
    {
        title:"Instagram",
        text:"A 3 personas les gustó tu publicación.",
        logo:"img/instagram.png"
    },

    {
        title:"TikTok",
        text:"Nuevo vídeo recomendado.",
        logo:"img/tiktok.png"
    },

    {
        title:"YouTube",
        text:"No te pierdas este contenido.",
        logo:"img/youtube.png"
    },

    {
        title:"Instagram",
        text:"Hace tiempo que no entras.",
        logo:"img/instagram.png"
    },

    {
        title:"TikTok",
        text:"Hay nuevo contenido para ti.",
        logo:"img/tiktok.png"
    }

];

function createNotification(){

    const random =
        notifications[Math.floor(Math.random() * notifications.length)];

    const notification =
        document.createElement("div");

    notification.classList.add("notification");

    notification.innerHTML = `

        <div class="notification-header">

            <img src="${random.logo}" class="notification-logo">

            <strong>${random.title}</strong>

        </div>

        <p>${random.text}</p>

    `;

    document
        .getElementById("notification-container")
        .appendChild(notification);

    setTimeout(()=>{

        notification.remove();

    },4000);

}

const phoneSection =
document.querySelector(".phone-section");

let notificationsStarted = false;

window.addEventListener("scroll",()=>{

    if(
        !notificationsStarted &&
        window.scrollY >
        phoneSection.offsetTop - 300
    ){

        notificationsStarted = true;

        setInterval(createNotification,8000);

    }

});

// VIDEOS

const feed =
document.getElementById("feed");

const videos = [

    "videos/videotiktok.mp4",
    "videos/videotiktok1.mp4",
    "videos/videotiktok2.mp4",
    "videos/videotiktok3.mp4",
    "videos/videotiktok4.mp4",
    "videos/videotiktok5.mp4",
    "videos/videotiktok6.mp4",
    "videos/videotiktok7.mp4",
    "videos/videotiktok8.mp4"

];

function addCard(videoSrc){

    const card =
        document.createElement("div");

    card.classList.add("video-card");

    card.innerHTML = `

        <video muted loop playsinline controls preload="none">

            <source src="${videoSrc}" type="video/mp4">

        </video>

    `;

    feed.appendChild(card);
    const clip = card.querySelector('video');
    new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) clip.play().catch(() => {});
            else clip.pause();
        });
    }, {threshold: 0.25}).observe(clip);

}

if(feed){

    videos.forEach(video => {

        addCard(video);

    });

}

const acceptBtn =
document.getElementById("acceptBtn");

const configBtn =
document.getElementById("configBtn");

if(acceptBtn){

    function revealDarkPattern(){

        const nextSection =
            document.querySelector(".cookies-section")
            .nextElementSibling;

        nextSection.scrollIntoView({

            behavior:"smooth"

        });

    }

    acceptBtn.addEventListener(
        "click",
        revealDarkPattern
    );

    configBtn.addEventListener(
        "click",
        revealDarkPattern
    );

}