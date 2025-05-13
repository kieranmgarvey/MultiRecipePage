document.addEventListener("DOMContentLoaded", function () {
    const addProteinBtn = document.getElementById("add-protein-btn");
    const newProteinForm = document.getElementById("new-protein-form");
    const saveProteinBtn = document.getElementById("save-protein-btn");
    const proteinTypeSelect = document.getElementById("proteinType");
    const ingredientList = document.getElementById("ingredient-list");

    addProteinBtn.addEventListener("click", function () {
        newProteinForm.style.display = "block";
    });

    saveProteinBtn.addEventListener("click", async function () {
        const name = document.getElementById("new-protein-name").value.trim();

        if (!name) {
            alert("Protein name is required.");
            return;
        }

        try {
            const response = await fetch("/add-recipe/add-protein", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                const newProtein = await response.json();

                const option = document.createElement("option");
                option.value = newProtein.name;
                option.textContent = newProtein.name;
                option.selected = true;
                proteinTypeSelect.appendChild(option);

                const ingredientItem = document.createElement("div");
                ingredientItem.className = "ingredient-item";
                ingredientItem.innerHTML = `
                    <input type="checkbox" id="ingredient-${newProtein.id}" name="ingredients" value="${newProtein.id}" checked>
                    <label for="ingredient-${newProtein.id}">${newProtein.name}</label>
                `;
                ingredientList.appendChild(ingredientItem);

                newProteinForm.style.display = "none";
                document.getElementById("new-protein-name").value = "";
            } else {
                alert("Failed to add protein. Please try again.");
            }
        } catch (error) {
            console.error("Error adding protein:", error);
            alert("An error occurred while adding the protein.");
        }
    });

    proteinTypeSelect.addEventListener("change", function () {
        const selectedProtein = proteinTypeSelect.value;
        const ingredientCheckbox = Array.from(ingredientList.querySelectorAll("input[type='checkbox']")).find(
            checkbox => checkbox.nextElementSibling.textContent === selectedProtein
        );

        if (ingredientCheckbox) {
            ingredientCheckbox.checked = true;
        }
    });
});
