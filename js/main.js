document.addEventListener('DOMContentLoaded', app)

function app () {
    changeComponent('newPointer')

    document.getElementById("search").addEventListener("click", e => changeComponent('search'))
    document.getElementById("add").addEventListener("click", e => changeComponent('newPointer'))
    document.getElementById("list").addEventListener("click", e => changeComponent('contact'))
}

function allTitleAndUrl() {
    chrome.tabs.query({}, function (tabs) {
        return tabs.map(tab => { return { title: tab.title, url: tab.url}})
    } )
}

function changeComponent(page) {
    var contentDiv = document.getElementById('body')
 
    switch (page) {
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
                addPointer(contentDiv)
                break;
        default:
                contentDiv.innerHTML = '<h2>Page not found!</h2>';
    }
}
