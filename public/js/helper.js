const insertOptions = () =>{
    let options = ['cup', 'grams', 'lbs','mL','ounce','piece','tablespoon','teaspoon','other']
    let optionHTML = ""
    for(elem of options){
        optionHTML+= "<option value=" + elem + ">" + elem + "</option>"
    }
    return optionHTML
}
const addIngredientListForm = () =>{
    let article = document.createElement('article')

    article.innerHTML = `
        <section class="form-group row">
                <fieldset class="col">
                    <label for="ingredient"></label>
                    <input type="text" class="form-control" id="ingredient" name="ingredient" placeholder="Ingredient">
                </fieldset>
                <fieldset class="col-sm-2">
                    <label for="measurement"></label>
                    <input type="text" class="form-control" id="measurement" name="measurement" placeholder="Measurement">
                </fieldset>
                <fieldset class="col-sm-auto">
                    <label for="measurementType"></label>
                    <select class="custom-select form-control custom-select-sm" name="measurementType" id="measurementType">
                        <option value="" disabled selected hidden>Measurement Type</option>
                        ${insertOptions()}
                        </select>
                </fieldset>
            </section>`
        document.getElementById('ingredient-list').appendChild(article)
        console.log(document.getElementById('ingredient-list'))
}

const removeIngredientListForm = () =>{
    let ingredient = document.getElementById('ingredient-list')
    if(ingredient.childElementCount >1) {
        ingredient.removeChild(ingredient.lastElementChild)
    }

}

const addDirectionForm = () =>{
    let article = document.createElement('article')

    article.innerHTML = `
        <fieldset>
        <label for="directions"></label>
        <textarea type="text" class="form-control" id="directions" name="directions" placeholder="Enter Directions"></textarea> 
    </fieldset>
            `
        document.getElementById('direction-list').appendChild(article)
        console.log(document.getElementById('direction-list'))
}

const removeDirectionForm = () =>{
    let direction = document.getElementById('direction-list')
    if(direction.childElementCount >1) {
        direction.removeChild(direction.lastElementChild)
    }

}