/* =========================================
   TRIBUTE PAGE
   OIB-SIP WEB DEVELOPMENT
========================================= */


/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle =
    document.getElementById("menu-toggle");

const navMenu =
    document.getElementById("nav-menu");


menuToggle.addEventListener(
    "click",
    () => {

        navMenu.classList.toggle("active");

    }
);


/* =========================================
   CLOSE MOBILE MENU
   AFTER CLICKING A LINK
========================================= */

const navLinks =
    document.querySelectorAll(
        "#nav-menu a"
    );


navLinks.forEach(link => {

    link.addEventListener(
        "click",
        () => {

            navMenu.classList.remove(
                "active"
            );

        }
    );

});


/* =========================================
   MESSAGE MODAL
========================================= */

const messageButton =
    document.getElementById(
        "message-button"
    );

const messageModal =
    document.getElementById(
        "message-modal"
    );

const closeModal =
    document.getElementById(
        "close-modal"
    );


/* Open modal */

messageButton.addEventListener(
    "click",
    () => {

        messageModal.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";

    }
);


/* Close modal */

closeModal.addEventListener(
    "click",
    closeMessage
);


/* Close when clicking outside */

messageModal.addEventListener(
    "click",
    event => {

        if (
            event.target === messageModal
        ) {

            closeMessage();

        }

    }
);


/* Close function */

function closeMessage() {

    messageModal.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";

}


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            messageModal.classList.contains(
                "active"
            )
        ) {

            closeMessage();

        }

    }
);


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(
        ".timeline-item, .achievement-card, .portrait-card"
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.style.opacity =
                        "1";

                    entry.target.style.transform =
                        "translateY(0)";

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.15
        }
    );


revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform =
        "translateY(25px)";

    element.style.transition =
        "opacity 0.6s ease, transform 0.6s ease";

    observer.observe(element);

});


/* =========================================
   NAVBAR SCROLL EFFECT
========================================= */

const navbar =
    document.querySelector(".navbar");


window.addEventListener(
    "scroll",
    () => {

        if (
            window.scrollY > 50
        ) {

            navbar.style.boxShadow =
                "0 5px 25px rgba(0,0,0,0.15)";

        } else {

            navbar.style.boxShadow =
                "none";

        }

    }
);