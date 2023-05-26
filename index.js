import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const addBtn = document.getElementById('add-btn')
const inputField = document.getElementById('input-field')
const shoppingListItems = document.querySelector('.list-items')

const appSettings = {
    databaseURL: 'https://catcartapp-default-rtdb.europe-west1.firebasedatabase.app/'
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, 'shoppingList')


addBtn.addEventListener('click', () => {
    let inputValue = inputField.value

    clearInputField()
    renderShoppingListItems(inputValue)
    push(shoppingListInDB, inputValue)
})

onValue(shoppingListInDB, (snapshot) => {
    if (snapshot.exists()) {
        let snapshotValue = Object.entries(snapshot.val())

        clearShoppingListItems()

        for (let i = 0; i < snapshotValue.length; i++) {
            let currentItem = snapshotValue[i]
            let itemId = currentItem[0]
            let itemValue = currentItem[1]

            renderShoppingListItems(currentItem)
        }
    } else {
        shoppingListItems.innerHTML = `
            <span class="message">
                <span>*</span>Taper un mot pour l'ajouter à votre liste et double clic sur le mot pour le supprimer de la liste!
            </span>`
    }
})

function clearShoppingListItems() {
    shoppingListItems.innerHTML = ''
}

function clearInputField() {
    inputField.value = ''
}

function renderShoppingListItems(item) {
    let itemId = item[0]
    let itemValue = item[1]

    if (item) {
        let li = document.createElement('li')
        li.className = 'single-item'
        li.textContent = itemValue

        li.addEventListener('click', () => {
            const itemLocationInDB = ref(database, `shoppingList/${itemId}`)
            remove(itemLocationInDB)
        })
        shoppingListItems.append(li)
    }
}

