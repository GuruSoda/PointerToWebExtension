function addPointer (element) {
    element.innerHTML = `
    <div class="row">
        <div class="col s12">
            <div class="card-panel">
                <form id="form-pointer">
                    <div class="row" style="margin-bottom: 0px;">
                        <div class="input-field col s12">
                            <label for="titulo">Title</label>
                            <input id="titulo" type="text" class="validate">
                        </div>
                    </div>
                    <div class="row" style="margin-bottom: 0px;">
                        <div class="input-field col s12">
                            <label for="url">URL</label>
                            <input id="url" type="text" class="validate">
                        </div>
                    </div>
                    <div class="row" style="margin-bottom: 0px;">
                        <div class="input-field col s12">
                            <label for="description">Description</label>
                            <input id="description" type="text" class="validate">
                        </div>
                    </div>
                    <div class="row" style="margin-bottom: 0px;">
                        <div class="input-field col s12">
                            <label for="labels">Labels</label>
                            <div class="chips chips-placeholder">
                                <input id="labels" class="custom-class">
                            </div>
                        </div>
                    </div>
                    <div class="row" style="margin-bottom: 0px;">
                        <div class="input-field col s12">
                            <select id="stars">
                                <option value="" disabled>Choose Stars</option>
                                <option value="1">1</option>
                                <option value="2" selected>2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            <label>Stars</label>
                        </div>
                    </div>
                    <div class="row" style="margin-bottom: 0px;">
                        <div class="col s12">
                            <button id="apuntar" class="waves-effect waves-light btn" type="submit">Apuntar!</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>`;

    var elems = document.querySelectorAll('select');
    var instances2 = M.FormSelect.init(elems, {});

    var elems = document.querySelectorAll('.chips');
    var instances = M.Chips.init(elems, {});

    if (typeof chrome !== 'undefined') {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (info) {
            document.getElementById('titulo').value = info[0].title
            document.getElementById('url').value = info[0].url
            M.updateTextFields()
        })
    }

    document.getElementById("form-pointer").addEventListener("submit", function(e) {
        e.preventDefault()

        let pointer = {}
        pointer.title = document.getElementById('titulo').value
        pointer.url = document.getElementById('url').value
        pointer.description = document.getElementById('description').value
        pointer.labels = instances[0].chipsData.map(chip => chip.tag)
        pointer.stars = parseInt(document.getElementById('stars').value, 10)

        try {
            newPointer(pointer)
            document.getElementById('body').innerHTML = '<p>Re Bien!</p>'
        } catch (error) {
            document.getElementById('body').innerHTML = '<p>' + error + '</p>'
        }
    })
}
