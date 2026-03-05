const categoriesContainer = document.getElementById('categoriesContainer');
const treesContainer = document.getElementById('treesContainer')
const spinner = document.getElementById('spinner')
const allTrees =document.getElementById('all-trees');
allTrees.addEventListener('click',()=>{
    toggleBtn(allTrees);
    loadTrees();
})

function showSpinner(status) {
    if (status == true) {
        spinner.classList.remove('hidden');
        treesContainer.classList.add('hidden')
    } else {
        spinner.classList.add('hidden');
        treesContainer.classList.remove('hidden')
    }
}
function toggleBtn(btn) {

    const buttons = document.querySelectorAll(".categories-btn ,#all-trees");
    buttons.forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-normal');
    });
    btn.classList.remove('btn-normal');
    btn.classList.add('btn-primary');
}
async function selectCategory(id, btn) {
    showSpinner(true);
    toggleBtn(btn);
    const res =await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
    const data = await res.json();
    displayTrees(data.plants)
}
const loadCategories = async () => {
    const res = await fetch('https://openapi.programming-hero.com/api/categories');
    const data = await res.json();
    data.categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-normal w-full categories-btn';
        btn.innerHTML = `${category.category_name}`;
        btn.onclick = () => selectCategory(category.id, btn);
        categoriesContainer.append(btn)
    });
}
async function loadTrees() {
    showSpinner(true);
    const res = await fetch('https://openapi.programming-hero.com/api/plants');
    const data = await res.json();

    displayTrees(data.plants);
}
function displayTrees(Trees) {
    treesContainer.innerHTML = '';
    Trees.forEach(tree => {
        const newTree = document.createElement("div");
        newTree.className = 'card bg-neutral-content shadow';
        newTree.innerHTML = `
         
        <div class="card-body px-4 py-5 ">
            <figure>
                <img src="${tree.image}" 
                alt="${tree.name}" 
                title="${tree.name}"
                class="h-50 w-full object-cover rounded-xl"
                 />
            </figure>
            <h2 class="card-title">${tree.name}</h2>
            <p class="line-clamp-2">${tree.description}</p>
            <div class="flex justify-between pb-3"> 
                <span class="bg-[#DCFCE7] text-[#15803D] badge text-[16px] font-medium ">${tree.category}</span>
                <span class="font-bold text-xl">$${tree.price}</span>
            </div>
            <div class="card-actions ">
                <button class="btn btn-primary w-full rounded-full text-white">Add to Cart</button>
            </div>
        </div>
        `
        treesContainer.appendChild(newTree);
    });
    showSpinner(false)
}





loadTrees();
loadCategories();