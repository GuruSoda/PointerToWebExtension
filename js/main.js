document.addEventListener('DOMContentLoaded', app)

async function app () {
    M.AutoInit()
//    let  dataPointer = {}

//    changeComponent('progreso')

    changeComponent('login')

    // try {
    //     chrome.tabs.query({ active: true, lastFocusedWindow: true }, async function (info) {
    //         try {
    //             dataPointer = await getPointerByURL(info[0].url)

    //             changeComponent('header')

    //             changeComponent('newPointer', dataPointer)
    //         } catch (e) {
    //             switch (e.status) {
    //                 case 401: 
    //                     changeComponent('login')
    //                     break;
    //                 case 404:
    //                     changeComponent('header')
    //                     changeComponent('newPointer', dataPointer)
    //                     break;
    //                 default:
    //                     changeComponent('error', {message: 'Error Verificando URL'})
    //             }
    //         }
    //     })

    // } catch (e) {
    //     console.log('Acceso denegado!!!')
    //     changeComponent('error', {message: 'Problemas con el Login'})
    // }
}

function allTitleAndUrl() {
    chrome.tabs.query({}, function (tabs) {
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
                <nav>
                    <div class="nav-wrapper">
                    <a href="#" class="brand-logo right"><i class="material-icons">cloud_upload</i></a>
                    <ul id="nav-mobile" class="left">
                        <li><a id="search" href="#">Search</a></li>
                        <li><a id="add" href="#">Add New</a></li>
                        <li><a id="list" href="#">List</a></li>
                    </ul>
                    </div>
                </nav>
            </header>`

            document.getElementById("search").addEventListener("click", e => changeComponent('search'))
            document.getElementById("add").addEventListener("click", e => changeComponent('newPointer'))
            document.getElementById("list").addEventListener("click", e => changeComponent('contact'))
            break;
        case 'home':
            contentDiv.innerHTML = `
                <h2>
                    Welcome to the Home Page!
                </h2>
            `;
            break;
        case 'about':
            contentDiv.innerHTML = `
                <h2>About Us</h2>
                <p>
                    This is the about page content. Learn more 
                    about our purpose and team.
                </p>
                <p>
                    We're passionate about creating engaging and
                    informative SPAs.
                </p>
            `;
            break;
        case 'contact':
            contentDiv.innerHTML = 
                `<h2>Contact Us</h2> 
                <p>
                    Feel free to reach out to us!
                </p> 
                <form> 
                   <label for="name">Name:</label> 
                   <input type="text" id="name" name="name" 
                          placeholder="Your Name" required>
                   <label for="email">Email:</label> 
                   <input type="email" id="email" name="email" 
                          placeholder="Your Email" required>
                   <label for="message">Message:</label> 
                   <textarea id="message" name="message" 
                             placeholder="Your Message" 
                             rows="4" required>
                    </textarea>
                   <button type="submit">Send Message</button> 
                </form>`;
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
                        <div class="card-panel teal center-align">
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
