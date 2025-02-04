"use strict";
//Header burger
const burger = document.querySelector(".js-burger");
const header = document.querySelector(".js-header");
const body = document.querySelector("body");

const actions = document.querySelector('.header__action');
const navigation = document.querySelector('.header__nav');
const wrapper = document.querySelector('.header__inner');


// Toggle burger menu
if (burger) burger.addEventListener("click", function () {
    burger.classList.toggle("active");
    header.classList.toggle("open-menu");

    if (burger.classList.contains("active")) {
        body.style.overflow = "hidden"; 
    } else {
        body.style.overflow = "visible"; 
    }
});

// Move actions based on screen width
function moveActions() {
    if (window.innerWidth < 1072) {
        if (navigation && !navigation.contains(actions)) {
            navigation.append(actions);
        }
    } else {
        if (wrapper && !wrapper.contains(actions)) {
            wrapper.append(actions);
        }
    }
}

// Initial check and on resize
moveActions(); // Run on load
window.addEventListener("resize", moveActions); // Run on resize

//Swiper
document.addEventListener("DOMContentLoaded", () => {
    const swiper = new Swiper(".js-company-slider", {
        slidesPerView: "auto",
        spaceBetween: 30,
        loop: true,
        loopFillGroupWithBlank: false,
        loopAdditionalSlides: 15,
        speed: 5200,
        simulateTouch: false,
        freeMode: true,
        autoplay: {
            delay: 0,
            disableOnInteraction: false
        },
        breakpoints: {
            1800: {
                spaceBetween: 80
            },
            900: {
                spaceBetween: 50
            }
        }
    });
});


//Submit forms
const forms = document.querySelectorAll(".js-submit-form");

forms.forEach(function (form) {
  const formContainer = form.closest(".js-form-container");
  const formTitle = form.querySelector(".form__title");
  const submitButton = form.querySelector('button[type="submit"]');
  const notification = formContainer.querySelector(".js-notification");

  const fields = form.dataset.fields ? JSON.parse(form.dataset.fields) : [];

  const handleEmptyField = function (field) {
    const element = form.querySelector(field.id);
    const value = element.value.trim();
    if (field.required) {
      if (!value) {
        element.classList.add("empty-field");
      } else {
        element.classList.remove("empty-field");
      }
    }
  };

  const handleSubmitForm = function (evt) {
    evt.preventDefault();
    let hasEmptyFields = false;

    fields.forEach(function (field) {
      handleEmptyField(field);
      const value = form.querySelector(field.id).value.trim();
      if (field.required && !value) {
        hasEmptyFields = true;
      }
    });

    if (hasEmptyFields) {
      return;
    }

    const formData = {};
    fields.forEach(function (field) {
      formData[field.id.replace("#", "")] = form
        .querySelector(field.id)
        .value.trim();
    });
  
    fetch("https://", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function () {
        form.reset();
        if (formTitle) formTitle.classList.add("hidden");
        form.classList.add("hidden");
        notification.classList.add("show");
      })
      .catch(function () {
        // Temporary solution in case of error
        form.reset();
        if (formTitle) formTitle.classList.add("hidden");
        form.classList.add("hidden");
        notification.classList.add("show");
        console.log(JSON.stringify(formData));
      });
  };

  submitButton.addEventListener("click", handleSubmitForm);
});


// Animate Running Numbers
function getElementTop(element) {
    const rect = element?.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return rect ? rect.top + scrollTop : null;
}

function animateRunningNumbers(containerClass, numberClass) {
    const container = document.querySelector(`.${containerClass}`);
    const numbers = container?.querySelectorAll(`.${numberClass}`);
    if (!container || !numbers) return;

    let isAnimated = false;

    function handleScroll() {
        const containerTop = getElementTop(container);
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;

        if (containerTop && containerTop < scrollTop + windowHeight * 0.8 && !isAnimated) {
            isAnimated = true;
            numbers.forEach(number => {
                const targetValue = parseInt(number.textContent.replace(/\D/g, ''), 10);
                if (isNaN(targetValue)) return;

                let currentValue = 0;
                const increment = Math.ceil(targetValue / 100); // Animation speed
                const interval = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= targetValue) {
                        currentValue = targetValue;
                        clearInterval(interval);
                    }
                    number.textContent = `${currentValue}`;
                }, 20); // Update interval
            });

            window.removeEventListener("scroll", handleScroll);
        }
    }

    window.addEventListener("scroll", handleScroll);
}

animateRunningNumbers("js-running-value", "js-running-number");