async function addPointer (element) {
    const pointerForm = `
    <div id="notificaciones-add" class="row" style="margin-bottom: 0px;display: none">
        <div class="col s12">
            <div class="card-panel green accent-2 center-align" style="padding:0.75rem">
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
    <div class="row">
        <div class="col s12">
            <div class="card-panel">
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
                            <button id="guardar" class="waves-effect waves-light btn" type="submit" value="crear">Guardar<i class="material-icons right">send</i></button>
                        </div>
                        <div class="col s4 center">
                            <button id="actualizar" class="waves-effect waves-light btn" type="submit" value="borrar">Actualizar<i class="material-icons right">update</i></button>
                        </div>
                        <div class="col s4 right-align">
                            <button id="borrar" class="waves-effect waves-light btn" type="submit" value="borrar">Borrar<i class="material-icons right">cancel</i></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>`;

    let  dataPointer = {}

//        changeComponent('progreso')
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, async function (info) {
        element.innerHTML = pointerForm

        var elemSelect = document.querySelectorAll('select')
        var select = M.FormSelect.init(elemSelect, {})

        var elemChips = document.querySelectorAll('.chips')
        var chips = M.Chips.init(elemChips, {})

        try {
            dataPointer = await getPointerByURL(info[0].url)

            document.getElementById('guardar').classList.add("disabled")

            document.querySelector('#notificaciones-add span').textContent = "URL Ya Existe en el almacen de punteros"
            document.getElementById('notificaciones-add').style.display = 'block'

            pointerToForm(dataPointer, chips, elemSelect)

            console.log('puntero:', dataPointer)
        } catch (e) {
            if (e.status === 401) return changeComponent('login')

            document.getElementById('actualizar').classList.add("disabled")
            document.getElementById('borrar').classList.add("disabled")

            dataPointer.title = info[0].title
            dataPointer.url  = info[0].url

            pointerToForm(dataPointer, chips, elemSelect)
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
    
    function pointerToForm(dataPointer, chips, select) {
        document.getElementById('titulo').value = dataPointer.title
        document.getElementById('url').value = dataPointer.url
        document.getElementById('description').value = dataPointer.description || ''
        document.getElementById('stars').value = (dataPointer.stars) ? dataPointer.stars.toString() : "3"

        if (dataPointer.labels)
            dataPointer.labels.forEach(chip => chips[0].addChip({tag: chip}))

        M.FormSelect.init(select)
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

//    const accessToken = await getItem('accessToken')

    let counters = {}

    try {
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
