document.addEventListener("DOMContentLoaded", function () {
    const addIngredientBtn = document.getElementById("add-ingredient-btn");
    const newIngredientForm = document.getElementById("new-ingredient-form");
    const saveIngredientBtn = document.getElementById("save-ingredient-btn");
    const ingredientSearch = document.getElementById("ingredient-search");
    const ingredientList = document.getElementById("ingredient-list");

    addIngredientBtn.addEventListener("click", function () {
        newIngredientForm.style.display = "block";
    });

    saveIngredientBtn.addEventListener("click", async function () {
        const name = document.getElementById("new-ingredient-name").value.trim();

        if (!name) {
            alert("Ingredient name is required.");
            return;
        }

        try {
            const response = await fetch("/add-recipe/add-ingredient", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                const newIngredient = await response.json();
                const ingredientItem = document.createElement("div");
                ingredientItem.className = "ingredient-item";
                ingredientItem.innerHTML = `
                    <input type="checkbox" id="ingredient-${newIngredient.id}" name="ingredients" value="${newIngredient.id}">
                    <label for="ingredient-${newIngredient.id}">${newIngredient.name}</label>
                `;
                ingredientList.appendChild(ingredientItem);

                newIngredientForm.style.display = "none";
                document.getElementById("new-ingredient-name").value = "";
            } else {
                alert("Failed to add ingredient. Please try again.");
            }
        } catch (error) {
            console.error("Error adding ingredient:", error);
            alert("An error occurred while adding the ingredient.");
        }
    });

    ingredientSearch.addEventListener("input", function () {
        const filter = ingredientSearch.value.toLowerCase();
        const items = ingredientList.querySelectorAll(".ingredient-item");

        items.forEach(item => {
            const label = item.querySelector("label").innerText.toLowerCase();
            item.style.display = label.includes(filter) ? "block" : "none";
        });
    });
});
