const parallax_el = document.querySelectorAll(".parallax");
const main = document.querySelector("main");

let xValue = 0, yValue = 0;
let rotateDegree = 0;

function update(cursorPosition) {
    parallax_el.forEach((el) => {
        let speedx = el.dataset.speedx;
        let speedy = el.dataset.speedy;
        let speedz = el.dataset.speedz;
        let rotateSpeed = el.dataset.rotation;

        let isInLeft = parseFloat(getComputedStyle(el).left) < window.innerWidth / 2 ? 1 : -1;
        let zValue = cursorPosition - parseFloat(getComputedStyle(el).left) * isInLeft * 0.1;

        el.style.transform = `rotateY(${rotateDegree * rotateSpeed}deg) translateX(calc(-50% + ${-xValue * speedx}px)) translateY(calc(-50% + ${yValue * speedy}px)) perspective(2300px) translateZ(${zValue * speedz}px)`;
    });
}
update(0);

window.addEventListener("mousemove", (e) => {
    if (timeline.isActive()) return;
    xValue = e.clientX - window.innerWidth / 2;
    yValue = e.clientY - window.innerHeight / 2;

    rotateDegree = (xValue / (window.innerWidth / 2)) * 20;
    update(e.clientX);
});

main.style.maxHeight = `${window.innerWidth * 0.6}px`;

/* GSAP ANIMATION  */
let timeline = gsap.timeline();

Array.from(parallax_el)
    .filter((el) => !el.classList.contains("text"))
    .forEach((el) => {
        timeline.from(
            el,
            {
                top: `${el.offsetHeight / 2 + +el.dataset.distance}px`,
                duration: 3.5, // Adjusted duration to make the animation more noticeable
                ease: "power3.out"
            },
            "1"
        );
    });

timeline.from(".text h1", {
    y:
        window.innerHeight -
        document.querySelector(".text h1").getBoundingClientRect().top + 200,
    duration: 2,
}, "2.5")
.from(".text h2", {
    y: -150,
    opacity: 0,
    duration: 1.5,
}, "3")
.from(".hide", {
    opacity: 0,
    duration: 1.5,
}, "3");

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
    // Select the form and result display element
    const climateForm = document.getElementById("climate-form");
    const resultSection = document.getElementById("result");

    // Function to calculate carbon impact based on inputs
    function calculateImpact(energy, water, waste, transport) {
        // Example calculation logic (you can adjust the formula as needed)
        const energyImpact = energy * 0.92; // Example conversion factor
        const waterImpact = water * 0.05;   // Example conversion factor
        const wasteImpact = waste * 1.1;    // Example conversion factor
        const transportImpact = transport * 0.21; // Example conversion factor

        // Total impact
        const totalImpact = energyImpact + waterImpact + wasteImpact + transportImpact;
        return totalImpact.toFixed(2); // Return the result formatted to two decimal places
    }

    // Event listener for form submission
    climateForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Retrieve input values from the form
        const energy = parseFloat(document.getElementById("energy-consumption").value);
        const water = parseFloat(document.getElementById("water-usage").value);
        const waste = parseFloat(document.getElementById("waste-generated").value);
        const transport = parseFloat(document.getElementById("transportation").value);

        // Calculate impact
        const totalImpact = calculateImpact(energy, water, waste, transport);

        // Display the result
        resultSection.textContent = `Total Carbon Impact: ${totalImpact} kg CO₂e`;
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const carbonForm = document.getElementById("carbon-form");
    const resultSection = document.getElementById("result");

    // Carbon calculation function
    function calculateCarbonFootprint(distance, fuel, electricity, waste) {
        const fuelEmissionFactor = 2.31; // kg CO2e per liter of fuel
        const electricityEmissionFactor = 0.527; // kg CO2e per kWh
        const wasteEmissionFactor = 0.45; // kg CO2e per kg

        // Calculate fuel, electricity, and waste impact
        const fuelImpact = (distance / 100) * fuel * fuelEmissionFactor;
        const electricityImpact = electricity * electricityEmissionFactor;
        const wasteImpact = waste * wasteEmissionFactor;

        // Total carbon footprint
        return (fuelImpact + electricityImpact + wasteImpact).toFixed(2);
    }

    // Handle form submission
    carbonForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get input values
        const distance = parseFloat(document.getElementById("distance").value);
        const fuel = parseFloat(document.getElementById("fuel").value);
        const electricity = parseFloat(document.getElementById("electricity").value);
        const waste = parseFloat(document.getElementById("waste").value);

        // Check if inputs are valid numbers
        if (isNaN(distance) || isNaN(fuel) || isNaN(electricity) || isNaN(waste)) {
            resultSection.textContent = "Please enter valid values for all fields.";
            return;
        }

        // Calculate carbon footprint
        const totalImpact = calculateCarbonFootprint(distance, fuel, electricity, waste);

        // Display result
        resultSection.textContent = `Total Carbon Footprint: ${totalImpact} kg CO₂e`;
    });
});
