const categoriesContainer = document.getElementById('categoriesContainer');
const treesContainer = document.getElementById('treesContainer')
const spinner = document.getElementById('spinner')
const allTrees = document.getElementById('all-trees');
const treeDetailsModal = document.getElementById('tree-details-modal');
const treeName = treeDetailsModal.querySelector('#treeName');
const treeCategory = treeDetailsModal.querySelector('#treeCategory');
const treePrice = treeDetailsModal.querySelector('#treePrice');
const treeImage = treeDetailsModal.querySelector('#treeImage');
const treeDescription = treeDetailsModal.querySelector('#treeDescription');
const cartCardContainer = document.getElementById('cartCardContainer');
const cartTotal = document.getElementById('cartTotal');
const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
let cart = [];
allTrees.addEventListener('click', () => {
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
    const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
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
                onclick = "showModal(${tree.id})"
                class="h-50 w-full object-cover rounded-xl  cursor-pointer "
                 />
            </figure>
            <h2 class="card-title cursor-pointer hover:text-[#15803D]" onclick = "showModal(${tree.id})">${tree.name}</h2>
            <p onclick = "showModal(${tree.id})" class="line-clamp-2  cursor-pointer hover:text-[#15803D]">${tree.description}</p>
            <div class="flex justify-between pb-3"> 
                <span class="bg-[#DCFCE7] text-[#15803D] badge text-[16px] font-medium ">${tree.category}</span>
                <span class="font-bold text-xl">$${tree.price}</span>
            </div>
            <div class="card-actions ">
                <button class="btn btn-primary w-full rounded-full text-white" onclick="addToCart('${tree.id}','${tree.name}','${tree.price}')">Add to Cart</button>
            </div>
        </div>
        `
        treesContainer.appendChild(newTree);
    });
    showSpinner(false)
}
async function showModal(id) {
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
    const data = await res.json();
    const plant = data.plants;
    treeName.innerText = plant.name;
    treePrice.innerText = plant.price;
    treeCategory.innerText = plant.category;
    treeImage.src = plant.image;
    treeDescription.innerText = plant.description;
    modalAddToCartBtn.addEventListener('click', () => {
        addToCart(plant.id, plant.name, plant.price)


    })
    treeDetailsModal.showModal();
}
function addToCart(id, name, price) {
    const cartCardInfo = {
        id,
        name,
        price,
        quantity: 1,
    }
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(cartCardInfo);
    }
    displayCart();
}
function displayCart() {
    cartCardContainer.innerHTML = ''
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const newCard = document.createElement('div');
        newCard.className = 'card card-body shadow space-y-5'
        newCard.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h2 class=" font-semibold">${item.name}</h2>
                    <div>
                        <p class="text-xs text-gray-400">$<span>${item.price}</span>X <span>${item.quantity}</span></p>
                    </div>
                </div>
                    <button class="btn btn-ghost " onclick="removeCart('${item.id}')">X</button>
                </div>
                <p class="font-bold text-xl">${item.price * item.quantity}</p>
                            
       `
        cartCardContainer.appendChild(newCard);

    });
    cartTotal.innerText = total
}
function removeCart(id) {
    cart = cart.filter(item => item.id != id);
    displayCart();

}




loadTrees();
loadCategories();