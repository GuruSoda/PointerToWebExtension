async function addPointer (element) {
    const pointerForm = `
    <div id="notificaciones-add" class="row" style="/*margin-bottom: 0px;*/display: none">
        <div class="col s12">
            <div class="card-panel red darken-1 center-align" style="padding:0.75rem">
                <span class="white-text" style="font-size: 1.2rem;"></span>
            </div>
        </div>
    </div>
    <div id="progress-add" class="row" style="margin-bottom: 0px;display:none">
        <div class="col s12">
            <div class="progress">
            <div class="indeterminate"></div>
            </div>
        </div>
    </div>
    <div class="row" style="margin-top: 2rem">
        <div class="col s12">
            <div classsss="card-panel brown lighten-5">
                <form id="form-pointer">
                    <div class="row" style="margin-bottom: 0px;">
                        <div class="input-field col s12" style="margin-top:0px">
                            <label for="titulo">Title</label>
                            <input id="titulo" type="text" class="validate">
                        </div>
                    </div>
                    <div class="row" style="margin-bottom: 0px;">
                        <div class="input-field col s12" style="margin-top:0px">
                            <label for="url">URL</label>
                            <input id="url" type="text" class="validate">
                        </div>
                    </div>
                    <div class="row" style="margin-bottom: 0px;">
                        <div class="input-field col s12" style="margin-top:0px">
                            <label for="description">Description</label>
                            <input id="description" type="text" class="validate">
                        </div>
                    </div>
                    <div class="row" style="margin-bottom: 0px;">
                        <div class="input-field col s8" style="margin-top:0px">
                            <label for="labels">Labels</label>
                            <div class="chips chips-placeholder">
                                <input id="labels" class="">
                            </div>
                        </div>
                        <label for="stars">Stars</label>
                        <div class="input-field col s4" style="margin-top:-5px">
                            <select id="stars">
                                <option value="" disabled>Choose Stars</option>
                                <option value="1">1</option>
                                <option value="2" selected>2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                    </div>
                    <div class="row" style="margin-bottom: 0px;">
                        <div class="col s4 left-align">
                            <button id="guardar" class="waves-effect waves-light btn deep-purple lighten-2" type="submit" value="crear">Guardar<i class="material-icons right">send</i></button>
                        </div>
                        <div class="col s4 center">
                            <button id="actualizar" class="waves-effect waves-light btn deep-purple lighten-2" type="submit" value="borrar">Actualizar<i class="material-icons right">update</i></button>
                        </div>
                        <div class="col s4 right-align">
                            <button id="borrar" class="waves-effect waves-light btn deep-purple lighten-2" type="submit" value="borrar">Borrar<i class="material-icons right">cancel</i></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>`;

    let  dataPointer = {}

    let elemSelect, select
    let elemChips, chips

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, async function (info) {
        element.innerHTML = pointerForm

        elemChips = document.querySelectorAll('.chips')
        chips = M.Chips.init(elemChips, {})

        try {
            dataPointer = await getPointerByURL(info[0].url)

            document.getElementById('guardar').classList.add("disabled")

            document.querySelector('#notificaciones-add span').textContent = "URL Ya Existe en el almacen de punteros"
            document.getElementById('notificaciones-add').style.display = 'block'

            pointerToForm(dataPointer)

            console.log('puntero:', dataPointer)
        } catch (e) {
            if (e.status === 401) return changeComponent('login')

            document.getElementById('actualizar').classList.add("disabled")
            document.getElementById('borrar').classList.add("disabled")

            dataPointer.title = info[0].title
            dataPointer.url  = info[0].url

            pointerToForm(dataPointer)
        }

        document.getElementById("form-pointer").addEventListener("submit", listenerButtons)
    })

    async function listenerButtons(e) {
        console.log(e.submitter.id)
        console.log(e)
        e.preventDefault()

        formToPointer(dataPointer)

        switch (e.submitter.id) {
        case 'guardar':
                try {
                    changeComponent('progreso')
                    await newPointer(dataPointer)
                    changeComponent('informacion', {message: 'Puntero Agregado Correctamente'})
                } catch (error) {
                    changeComponent('error', {message: error.errorField})
                }
                break;
        case 'actualizar':
                try {
                    changeComponent('progreso')
                    await updatePointer(dataPointer)
                    changeComponent('informacion', {message: 'Puntero Modificado Correctamente'})
                } catch (error) {
                    changeComponent('error', {message: error.errorField})
                }
                break;
        case 'borrar':
                try {
                    changeComponent('progreso')
                    await deletePointer(dataPointer)
                    changeComponent('informacion', {message: 'Puntero Borrado Correctamente'})
                } catch (error) {
                    changeComponent('error', {message: error.errorField})
                }
                break;
        default:
                break;
        }
    }

    function formToPointer(Pointer) {

        Pointer.title = document.getElementById('titulo').value
        Pointer.url = document.getElementById('url').value
        Pointer.description = document.getElementById('description').value
        Pointer.labels = chips[0].chipsData.map(chip => chip.tag)
        Pointer.stars = parseInt(document.getElementById('stars').value, 10)

        return Pointer
    }
    
    function pointerToForm(dataPointer) {
        console.log('pointer:', dataPointer)

        document.getElementById('titulo').value = dataPointer.title
        document.getElementById('url').value = dataPointer.url
        document.getElementById('description').value = dataPointer.description || ''
        document.getElementById('stars').value = dataPointer.stars || 2

        if (dataPointer.labels)
            dataPointer.labels.forEach(chip => chips[0].addChip({tag: chip}))

        M.FormSelect.init(document.querySelectorAll('select'))
        M.updateTextFields()
    }
}

async function componentLogin(element) {
    const loginForm = `
    <main class="container">
        <div class="card grey lighten-2">
            <div class="card-content white-text">
                <span class="card-title black-text center">Ingreso a Puntero Web</span>
                <form id="form-login">
                    <div class="row">
                        <div class="input-field col s12">
                        <input id="email" type="email" class="validate">
                        <label for="email">Email</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                        <input id="password" type="password" class="validate">
                        <label for="password">Password</label>
                        </div>
                    </div>

                    <div class="row" style="margin-bottom: 0px;">
                        <div class="col left-align">
                            <button id="guardar" class="waves-effect waves-light btn green lighten-2" type="submit" value="crear">Ingresar<i class="material-icons right">send</i></button>
                        </div>
                        <div class="right-align">
                            <button id="borrar" class="waves-effect waves-light btn green lighten-2" type="submit" value="borrar">Cancelar<i class="material-icons right">cancel</i></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </main>`

    let counters = {}

    try {
//        changeComponent('progreso')
        counters = await svcCountPointers()
        console.log(counters)

        changeComponent('header')
        changeComponent('newPointer')
    } catch (e) {
        element.innerHTML = loginForm

        document.getElementById("form-login").addEventListener("submit", async function(e) {
            e.preventDefault()

            const email = document.getElementById('email').value
            const password = document.getElementById('password').value

            try {
                const dataUser = await svcLogin(email, password)
                console.log('dataUser:', dataUser)

                changeComponent('header')
                changeComponent('newPointer')
             } catch (e) {
                if (e.status === 401) return changeComponent('login')
                console.log(e)
                changeComponent('error', {message: 'Usuario o Clave incorrectos'})
                return 
            }
        })
    }
}

function cardPointer(dataPointer) {

    let labels = ''

    if (dataPointer.labels) {
        dataPointer.labels.forEach(label => {
            labels += `<div class="chip grey darken-2 white-text">${label}</div>`
        })
    }

    const card = `
        <div class="col s12 m12">
            <div class="card horizontal light-green lighten-1" style="margin: 1rem 0rem 1rem 0;">
                <!-- <div class="card-image valign-wrapper">
                    <img src="https://materializecss.com/res/materialize.svg">
                </div> -->
                <div class="card-content white-text" style="padding:0rem 0.25rem 0rem 0.25rem;width: 100%;">
                    <p style="font-size: 1.35rem;margin-bottom: 0px;padding: 0.25rem;">${dataPointer.title}</p>
                    <p style="padding-left: 0.25rem;"><a class="blue-grey-text" href="${dataPointer.url}">${dataPointer.url}</a></p>
                    <div class="card-action" style="padding-left: 10px;padding-bottom: 0px;padding-right: 0px;padding-top: 8px;">
                    <div id="labels" class="left">
                    ${labels}
                    </div>
                    <div class="right" style="padding-top: 0.35rem;">
                        <a style="margin-right: 0px;margin-left: 1rem;" href="#"><i class="material-icons brown-text" style="font-size: 1.75rem;">edit</i></a>
                        <a style="margin-right: 0px;margin-left: 1rem;" href="#"><i class="material-icons brown-text" style="font-size: 1.75rem;">delete</i></a>
                    </div>
                </div>
        </div>
            </div>
        </div>`

    return card
}

function MakeListCard(listPointers) {

//    console.log('listPointers:', listPointers)
    let listCards = '<ul>'

    listPointers.forEach(function (pointer) {
        let card = '<li>'
        card += cardPointer(pointer)
        card += '</li>'

        listCards += card
    })

    listCards += '</ul>'

    return listCards
}

async function componentList(element) {

    try {
        const pointers = await svcGetPointers()
        console.log('pointers:', pointers)
        element.innerHTML = `
            <div style="width:98%;margin: 0 auto">
                ${MakeListCard(pointers)}
            </div>
        `
    } catch (e) {
        if (e.status === 401) return changeComponent('login')
        console.log(e)
        changeComponent('error', {message: e.errorField})
        return 
    }
}

async function componentSearch(element) {
}