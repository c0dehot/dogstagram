/* unlike node where we can pull in packages with npm, or react, for normal
    webpages, we can use a cool resource called unpkg from the html page, so
    in this example we use the moment npm package on both the server & client side */

/*
    note how we wrap our api fetch in this function that allows us to do some
    additional error / message handling for all API calls...
*/
async function apiCall( url, method='get', data={} ){
    method = method.toLowerCase()
    let settings = { method }

    // for formData we must NOT set content-type, let system do it
    const isFormData = (typeof data)==='string'
    if( !isFormData ) {
        settings.headers = { 'Content-Type': 'application/json' }
    }

    // only attach the body for put/post
    if( method === 'post' || method === 'put' ) {
        if( isFormData ){
            //* gather form data (esp. if attached media)
            //! each entry to be attached must have a valid **name** attribute
            settings.body = new FormData( document.querySelector(data) )
        } else {
            settings.body = JSON.stringify( data )
        }
    }

    const result = await fetch( url,settings ).then( res=>res.json() )

    /* put the api result message onto the screen as a message if it exists */
    if( result.status && result.message ){
        const apiResultEl = document.querySelector('#apiMessage')
        apiResultEl.innerHTML = result.message
        apiResultEl.classList.remove( 'd-none' )
        console.log( 'showing message: '+ result.message )
        setTimeout( function(){
            apiResultEl.classList.add( 'd-none' )
        }, 5000 )
    } else if( !result.status && result.message ){
        alert( 'Problems: ' + result.message )
    }

    return result
}




async function getDogs(){
    const dogList = await apiCall( '/api/dogs' )
    console.log( '[dogList]', dogList )

    const listEl = document.querySelector('#dogList')
    listEl.innerHTML = ''

    dogList.forEach( function( dog ){
        listEl.innerHTML += `
            <div class="card">
                <img src="${dog.image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${dog.title}</h5>
                    <img src='${dog.owner.thumbnail}' class="img-profile img-thumbnail rounded-circle" />`
                + dog.keywords.map( keyword => `<span class="badge bg-primary">${keyword}</span>` )
                + ` 
                </div>
                <small class="text-muted">${dog.createdAt ? 'Posted: '+moment(dog.createdAt).format('MMM Do, YYYY') : '' }</small>

                <hr />
                <form>
                    <div class="input-group mb-3">
                        <input id="comment_${dog._id}" type="text" class="form-control" placeholder="Write something about this dog">
                        <button onClick="publishComment(event, '${dog._id}')" class="btn btn-outline-primary" type="button" id="button-addon2">Publish</button>
                    </div>                            
                </form>

            </div>
        `
    })
}

async function publishComment( event, dogId ){
    // get teh comment first
    const comment = document.querySelector(`#comment_${dogId}`).value

    console.log( '[publishComment] comment=', comment )
    const publishResult = await apiCall( '/api/dogs/comment', 'post', { _id: dogId, comment } )
    console.log( ' .. finishing publishing comment for the dog: ', publishResult )
}

/* functions triggered by the html page */

// run once page has loaded
async function mainApp(){
    console.log( '[mainApp] starting...' )

    // show the dog list ...
    getDogs()
}

function showTodaysTasks(){
    document.querySelector('#todayTasksBtn').classList.add('d-none')
    document.querySelector('#allTasksBtn').classList.remove('d-none')

    const today = moment().format('YYYY-MM-DD')
    taskList( today )
}

function showAllTasks(){
    document.querySelector('#todayTasksBtn').classList.remove('d-none')
    document.querySelector('#allTasksBtn').classList.add('d-none')

    taskList()
}

// toggled by the [Add Task] button
function toggleTaskForm( forceHide=false ){
    const formEl = document.querySelector('#taskForm')
    if( !forceHide || formEl.classList.contains('d-none') ){
        formEl.classList.remove( 'd-none' )
    } else {
        formEl.classList.add( 'd-none' )
    }
}

// triggered by the [x] delete button
async function taskDelete( id ){
    const deleteResponse = await apiCall( `/api/tasks/${id}`, 'delete' )
    console.log( '[taskDelete] ', deleteResponse )

    taskList()
}

// save the new form
async function saveForm( event ){
    event.preventDefault()

    const formData = {
        priority: document.querySelector('#taskPriority').value,
        info: document.querySelector('#taskInfo').value,
        due: document.querySelector('#taskDue').value
    }

    // clear form
    document.querySelector('#taskPriority').value = ''
    document.querySelector('#taskInfo').value = ''
    document.querySelector('#taskDue').value = ''
    console.log( '[saveForm] formData=', formData )

    const saveResponse = await apiCall( '/api/tasks', 'post', formData )
    console.log( '[saveResponse] ', saveResponse )

    if( saveResponse.status ){
        // hide the form
        toggleTaskForm( true )

        // refresh the list
        taskList()
    }
}