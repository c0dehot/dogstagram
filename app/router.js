const orm = require('./orm');

// for the file-uploads
const UPLOAD_PATH = process.env.UPLOAD_PATH || 'public/uploads/'
const uploadResizer = require( './uploadResizer' )
const upload = require('multer')({ dest: UPLOAD_PATH })


function router( app ){
    app.get('/api/dogs', async function(req, res) {
        console.log( '[GET] getting dog list')
        const list = await orm.getDogList()

        res.send( list )
    })

    app.post( '/api/dogs', upload.single('imageFile'), async function( req, res ){
        const dogData = req.body
        dogData.image = dogData.imageUrl

        if( req.file ){
            // we have a picture upload so let's process it!
            const [ resizeWidth, resizeHeight ] = dogData.imageSize.split('x')
            const imageUrl = await uploadResizer('../'+req.file.path, req.file.originalname, resizeWidth, resizeHeight);
            // assign in the thumbData so can use as normal
            dogData.image = imageUrl
        }
        console.log( '[POST /api/dogs] dogData: ', dogData )

        const saveResult = await orm.saveDog( dogData )
        console.log( '[POST /api/dogs] saveResult: ', saveResult )

        if( saveResult._id ){
            res.send( { status: true, message: 'Dog saved' } )
        } else {
            res.send( { status: false, message: 'Someting went wong' } )
        }

    })
    // TODO: not working, comments not posted
    app.post( '/api/dogs/comment', async function( req, res ){
        // { _id, comment}
        console.log( '[POST /api/dogs/comment ]', req.body )

        const commentResult = await orm.addDogComment( { _id: req.body._id, comment: req.body.comment } )
        console.log( ' commentResult: ', commentResult )
        if( commentResult.nModified===1 ){
            res.send( { status: true, message: 'Saved comment' } )
        } else {
            res.send( { status: false, message: 'Someting went wong' } )
        }
    })
    // app.post('/api/tasks', async function(req, res) {
    //     console.log( '[POST] we received this data:', req.body )
    //     const saveResult = await orm.insertTask( req.body.priority, req.body.info, req.body.due )
    //     console.log( `... insertId: ${saveResult.insertId} ` )

    //     res.send( { status: true, insertId: saveResult.insertId, message: 'Saved successfully' } )
    // });

    // app.put('/api/tasks', async function(req, res) {
    //     console.log( '[PUT] we received this data:', req.body )
    //     if( !req.body.id ) {
    //         res.status(404).send( { message: 'Invalid id' } )
    //     }

    //     const saveResult = await orm.updateTask( req.body.id, req.body.priority, req.body.info, req.body.due )
    //     console.log( '... ', saveResult )
    //     res.send( { status: true, message: 'Updated successfully' } )
    // });

    // app.delete('/api/tasks/:id', async function(req, res) {
    //     const taskId = req.params.id
    //     console.log( `[DELETE] id=${taskId}` )
    //     const deleteResult = await orm.deleteTask( taskId )
    //     console.log( '... ', deleteResult )

    //     res.send( { status: true, message: 'Deleted successfully' } )
    // });
}

module.exports = router
