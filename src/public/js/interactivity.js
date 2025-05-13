document.addEventListener('DOMContentLoaded', function() {
    const ingredients = document.querySelectorAll('.ingredient');
    ingredients.forEach(ingredient => {
        ingredient.addEventListener('mouseenter', function() {
            const infoPopup = document.createElement('div');
            infoPopup.className = 'info-popup';
            infoPopup.innerText = ingredient.getAttribute('data-info');
            document.body.appendChild(infoPopup);
            const rect = ingredient.getBoundingClientRect();
            infoPopup.style.top = `${rect.top + window.scrollY}px`;
            infoPopup.style.left = `${rect.right + 10}px`;
        });

        ingredient.addEventListener('mouseleave', function() {
            const infoPopup = document.querySelector('.info-popup');
            if (infoPopup) {
                infoPopup.remove();
            }
        });
    });
    const proteinHeaders = document.querySelectorAll('.protein-header');

    proteinHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const recipesList = header.nextElementSibling;
            if (recipesList.style.display === 'none' || recipesList.style.display === '') {
                recipesList.style.display = 'block';
            } else {
                recipesList.style.display = 'none';
            }
        });
    });
    const searchInput = document.getElementById('recipe-search');
    const recipeItems = document.querySelectorAll('.recipe-item');

    searchInput.addEventListener('input', function() {
        const filter = searchInput.value.toLowerCase();
        recipeItems.forEach(item => {
            const title = item.querySelector('.recipe-title').innerText.toLowerCase();
            if (title.includes(filter)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
});