document.addEventListener("DOMContentLoaded", function() {
    const recipeForm = document.getElementById("add-recipe-form");
    const recipeNameInput = document.getElementById("recipeName");
    const instructionsInput = document.getElementById("instructions");
    const errorMessage = document.getElementById("error-message");

    recipeForm.addEventListener("submit", function(event) {
        console.log("Form submission triggered");
        let valid = true;
        let errors = [];

        if (recipeNameInput.value.trim() === "") {
            valid = false;
            errors.push("Recipe name is required.");
        }

        if (instructionsInput.value.trim() === "") {
            valid = false;
            errors.push("Instructions are required.");
        }

        if (!valid) {
            event.preventDefault();
            console.error("Form validation failed:", errors);
            errorMessage.innerHTML = errors.join("<br>");
            errorMessage.style.display = "block";
        } else {
            console.log("Form is valid, submitting...");
            errorMessage.style.display = "none";
        }
    });
});