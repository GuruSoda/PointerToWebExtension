document.addEventListener('DOMContentLoaded', app)

async function app () {
    allTitleAndUrl()

    M.AutoInit()

    changeComponent('login')
}

function allTitleAndUrl() {
    chrome.tabs.query({}, function (tabs) {
        console.log(tabs)
        return tabs.map(tab => { return { title: tab.title, url: tab.url}})
    } )
}

function changeComponent(page, option) {
    var contentDiv = document.getElementById('body')
 
    switch (page) {
        case 'login':
            componentLogin(document.getElementById('root'))
            break;
        case 'header':
            document.getElementById('root').innerHTML = `
            <header>
                <nav class="deep-purple lighten-3">
                    <div class="nav-wrapper">
                    <a href="#!" class="brand-logo right dropdown-trigger" data-target="menu-user"><i class="material-icons">person</i></a>
                    <!-- Dropdown Structure -->
                    <ul id="menu-user" class="dropdown-content deep-purple lighten-4">
                        <li><a href="#!"><i class="material-icons">settings</i>Settings</a></li>
                        <li><a href="#!"><i class="material-icons">exit_to_app</i>Logout</a></li>
                    </ul>
                    <ul id="nav-mobile" class="left">
                        <li><a id="search" href="#">Search</a></li>
                        <li><a id="add" href="#">Add New</a></li>
                        <li><a id="list" href="#">List</a></li>
                        <li><a id="current" href="#">Currents Tabs</a></li>
                    </ul>
                    </div>
                </nav>
            </header>`

            var elems = document.querySelectorAll('.dropdown-trigger');
            var instances = M.Dropdown.init(elems, {});

            document.getElementById("search").addEventListener("click", e => changeComponent('error', {message: 'Esto no esta'}))
            document.getElementById("add").addEventListener("click", e => changeComponent('newPointer'))
            document.getElementById("list").addEventListener("click", e => changeComponent('list'))
            break;
        case 'home':
            contentDiv.innerHTML = `
                <h2>
                    Welcome to the Home Page!
                </h2>
            `;
            break;
        case 'search':
            componentSearch(contentDiv)
            break;
        case 'list':
            componentList(contentDiv)
            break;
        case 'newPointer':
                addPointer(contentDiv, option)
                break;
        case 'error':
            contentDiv.innerHTML =
                `<div class="row">
                    <div class="col s12">
                        <div class="card pink darken-4 pulse" sytle="margin: auto">
                            <div class="card-content white-text center-align">
                                <span class="card-title left-align">Error</span>
                                <p style="font-size: 1.5em;">${option.message}</p>
                            </div>
                        </div>
                    </div>
                </div>`
                break;
        case 'informacion':
            contentDiv.innerHTML =
                ` <div class="row">
                    <div class="col s12">
                        <div class="card-panel teal lighten-2 center-align">
                        <span class="white-text" style="font-size: 1.5em;">${option.message}</span>
                        </div>
                    </div>
                </div>`
                break;
        case 'progreso':
            contentDiv.innerHTML =
                `<div class="progress">
                    <div class="indeterminate"></div>
                </div>`
            break;
        default:
            contentDiv.innerHTML = '<h2>Page not found!</h2>';
    }
}
